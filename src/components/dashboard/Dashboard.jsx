import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Plus,
  ExternalLink
} from 'lucide-react'

const Dashboard = () => {
  const { user, token, API_BASE_URL } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data.dashboard)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Leads',
      value: dashboardData?.total_leads || 0,
      icon: FileText,
      description: 'Leads submitted',
      color: 'text-blue-600'
    },
    {
      title: 'Total Commission',
      value: `$${(dashboardData?.total_commission || 0).toFixed(2)}`,
      icon: DollarSign,
      description: 'Total earned',
      color: 'text-green-600'
    },
    {
      title: 'Active Affiliates',
      value: dashboardData?.active_affiliates || 0,
      icon: Users,
      description: 'Your referrals',
      color: 'text-purple-600'
    },
    {
      title: 'Pending Payouts',
      value: `$${(dashboardData?.pending_payouts || 0).toFixed(2)}`,
      icon: TrendingUp,
      description: 'Awaiting payout',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your affiliate account today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commission Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
            <CardDescription>
              Your earnings over the last two months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-lg font-bold text-green-600">
                  ${(dashboardData?.commission_breakdown?.this_month || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Month</span>
                <span className="text-lg font-bold text-gray-600">
                  ${(dashboardData?.commission_breakdown?.last_month || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Your latest lead submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.recent_leads?.length > 0 ? (
                dashboardData.recent_leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{lead.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.lead_id}
                      </p>
                    </div>
                    <Badge variant={
                      lead.status === 'sold' ? 'default' :
                      lead.status === 'qualified' ? 'secondary' :
                      lead.status === 'in_review' ? 'outline' : 'secondary'
                    }>
                      {lead.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No leads submitted yet
                </p>
              )}
              {dashboardData?.recent_leads?.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View All Leads
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Information */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share this code with others to earn referral commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="bg-muted p-3 rounded-md font-mono text-lg">
                {user?.referral_code}
              </div>
            </div>
            <Button variant="outline">
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

