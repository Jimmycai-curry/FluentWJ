// Spec: 注销账号功能
// 说明: 用户注销账号接口
// 功能: 删除用户账号及相关数据

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, type JWTPayload } from '@/utils/jwt'

/**
 * POST /api/auth/delete-account
 * 
 * 功能：
 * 1. 验证用户身份（从 Cookie 获取 Token）
 * 2. 删除用户账号（物理删除）
 * 3. 清除 auth_token Cookie
 * 
 * 注意：
 * - 需要验证登录状态
 * - 物理删除用户数据（根据业务需求）
 * - 审计日志会被保留（满足合规要求）
 */
export async function POST(request: NextRequest) {
  console.log('[DeleteAccount] 注销账号请求')

  try {
    // 从 Cookie 获取 token 验证用户身份
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        error: { message: '未登录，无法注销账号' }
      }, { status: 401 })
    }

    // 使用 JWT 库验证 token
    const decoded = await verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({
        success: false,
        error: { message: '登录已过期，请重新登录' }
      }, { status: 401 })
    }

    const userId = decoded.userId
    console.log('[DeleteAccount] 准备注销用户:', userId)

    // 检查用户是否存在
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: { message: '用户不存在' }
      }, { status: 404 })
    }

    // 执行物理删除（删除用户账号）
    // 注意：审计日志根据法规要求需要保留，这里不删除 audit_logs
    await prisma.$transaction([
      // 删除用户的邮件历史记录
      prisma.mail_histories.deleteMany({
        where: { user_id: userId }
      }),
      // 删除用户的反馈记录
      prisma.feedbacks.deleteMany({
        where: { user_id: userId }
      }),
      // 删除用户账号（物理删除）
      prisma.users.delete({
        where: { id: userId }
      })
    ])

    console.log('[DeleteAccount] 用户注销成功:', userId)

    // 创建响应对象
    const response = NextResponse.json({
      success: true,
      message: '账号注销成功'
    })

    // 清除 auth_token Cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('[DeleteAccount] 注销失败:', error)
    return NextResponse.json({
      success: false,
      error: { message: '注销失败，请稍后重试' }
    }, { status: 500 })
  }
}
