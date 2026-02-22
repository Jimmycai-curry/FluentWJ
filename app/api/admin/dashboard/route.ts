// Spec: /docs/specs/admin-dashboard.md (待创建)
// 说明: Dashboard 数据接口，提供统计卡片、用户增长趋势、最新用户列表

import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats, getUserGrowthTrend, getLatestUsers } from '@/services/admin.service'
import { verifyToken } from '@/utils/jwt'
import { DashboardResponse } from '@/types/admin'

// 定义管理员验证结果的类型
interface AdminVerifyResult {
  payload: { userId: string; phone: string; role: number } | null
  response: NextResponse | null
}

/**
 * 验证管理员权限
 * 从 Cookie 读取 JWT Token 并验证，确保用户为管理员（role = 0）
 * 统一返回 { payload, response } 格式，避免 TypeScript 类型推断问题
 */
async function verifyAdmin(req: NextRequest): Promise<AdminVerifyResult> {
  // 从 Cookie 获取 Token
  const token = req.cookies.get('auth_token')?.value
  
  // Token 不存在
  if (!token) {
    return {
      payload: null,
      response: NextResponse.json(
        { success: false, error: 'Missing or invalid token' },
        { status: 401 }
      )
    }
  }

  // 验证 Token
  const payload = await verifyToken(token)

  // Token 无效或过期
  if (!payload) {
    return {
      payload: null,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }

  // 验证管理员角色（role = 0）
  if (payload.role !== 0) {
    return {
      payload: null,
      response: NextResponse.json(
        { success: false, error: 'Insufficient permissions. Admin role required.' },
        { status: 403 }
      )
    }
  }

  // 验证成功
  return { payload, response: null }
}

/**
 * GET /api/admin/dashboard
 * 获取 Dashboard 完整数据
 * 
 * 权限要求：管理员
 * 
 * 返回数据：
 * - stats: 统计数据（总用户量、今日新增、今日生成量、今日拦截）
 * - growthTrend: 用户增长趋势（30天）
 * - latestUsers: 最新注册用户（10条）
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/admin/dashboard - 开始处理')

    // 1. 验证管理员权限
    const authResult = await verifyAdmin(request)
    if (authResult.response) {
      console.error('[API] Dashboard 访问失败: 权限验证失败')
      return authResult.response
    }

    // 此时 payload 一定存在（response 为 null 时 payload 必定有值）
    const payload = authResult.payload!
    console.log(`[API] 管理员验证通过: ${payload.userId}`)

    // 2. 并行调用 3 个 Service 函数获取数据
    const [stats, growthTrend, latestUsers] = await Promise.all([
      getDashboardStats(),
      getUserGrowthTrend(30),
      getLatestUsers(10)
    ])

    // 3. 构建响应数据
    const response: DashboardResponse = {
      stats,
      growthTrend,
      latestUsers
    }

    console.log('[API] Dashboard 数据获取成功')

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] Dashboard 数据获取失败:', error)
    
    return NextResponse.json(
      { 
        error: '获取 Dashboard 数据失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
