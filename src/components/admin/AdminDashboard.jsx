import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Download
} from 'lucide-react'

const AdminDashboard = () => {
  const { token, API_BASE_URL } = useAuth()
  const [adminStats, setAdminStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [pendingPayouts, setPendingPayouts] = useState([])
  const [topAffiliates, setTopAffiliates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsResponse, leadsResponse, payoutsResponse, affiliatesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/admin/leads/recent`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/admin/payouts/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/admin/affiliates/top`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setAdminStats(statsData.stats)
      }

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json()
        setRecentLeads(leadsData.leads || [])
      }

      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json()
        setPendingPayouts(payoutsData.payouts || [])
      }

      if (affiliatesResponse.ok) {
        const affiliatesData = await affiliatesResponse.json()
        setTopAffiliates(affiliatesData.affiliates || [])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchAdminData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const approvePayout = async (payoutId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payouts/${payoutId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        fetchAdminData() // Refresh data
      }
    } catch (error) {
      console.error('Error approving payout:', error)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'sold':
        return 'default'
      case 'qualified':
        return 'secondary'
      case 'in_review':
        return 'outline'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage leads, affiliates, and payouts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats?.total_leads || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{adminStats?.leads_this_month || 0} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {adminStats?.active_affiliates || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminStats?.total_affiliates || 0} total registered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${adminStats?.pending_payouts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminStats?.pending_payout_count || 0} requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${adminStats?.total_revenue || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ${adminStats?.revenue_this_month || 0} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different admin views */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Recent Leads</TabsTrigger>
          <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="affiliates">Top Affiliates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                Latest lead submissions requiring review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No recent leads</h3>
                  <p className="text-muted-foreground">
                    New lead submissions will appear here
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-mono text-sm">
                            {lead.lead_id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {lead.full_name}
                          </TableCell>
                          <TableCell>
                            {lead.affiliate_name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {lead.lead_type?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(lead.status)}>
                              {lead.status?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateLeadStatus(lead.id, 'qualified')}
                                disabled={lead.status === 'qualified' || lead.status === 'sold'}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateLeadStatus(lead.id, 'sold')}
                                disabled={lead.status === 'sold'}
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payouts</CardTitle>
              <CardDescription>
                Payout requests awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPayouts.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending payouts</h3>
                  <p className="text-muted-foreground">
                    Payout requests will appear here for approval
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPayouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">
                            {payout.affiliate_name}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${parseFloat(payout.amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {payout.payment_method}
                          </TableCell>
                          <TableCell>
                            {new Date(payout.requested_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => approvePayout(payout.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="affiliates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Affiliates</CardTitle>
              <CardDescription>
                Affiliates with highest performance this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topAffiliates.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No affiliate data</h3>
                  <p className="text-muted-foreground">
                    Affiliate performance data will appear here
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Leads Submitted</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Total Earnings</TableHead>
                        <TableHead>Referrals</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAffiliates.map((affiliate) => (
                        <TableRow key={affiliate.id}>
                          <TableCell className="font-medium">
                            {affiliate.name}
                          </TableCell>
                          <TableCell>
                            {affiliate.total_leads}
                          </TableCell>
                          <TableCell>
                            {affiliate.conversion_rate}%
                          </TableCell>
                          <TableCell className="font-medium">
                            ${parseFloat(affiliate.total_earnings).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {affiliate.referral_count}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard

