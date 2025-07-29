import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Search,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const CommissionsPage = () => {
  const { token, API_BASE_URL } = useAuth()
  const [commissions, setCommissions] = useState([])
  const [payoutRequests, setPayoutRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCommissionData()
  }, [])

  const fetchCommissionData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/commissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCommissions(data.commissions || [])
      }
    } catch (error) {
      console.error('Error fetching commission data:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestPayout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/commissions/request-payout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        fetchCommissionData() // Refresh data
      }
    } catch (error) {
      console.error('Error requesting payout:', error)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'processing':
        return 'outline'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'processing':
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredCommissions = commissions.filter(commission =>
    commission.lead_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.commission_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const totalEarned = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + parseFloat(c.amount), 0)

  const pendingAmount = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + parseFloat(c.amount), 0)

  const thisMonthEarnings = commissions
    .filter(c => {
      const commissionDate = new Date(c.created_at)
      const now = new Date()
      return c.status === 'paid' && 
             commissionDate.getMonth() === now.getMonth() && 
             commissionDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, c) => sum + parseFloat(c.amount), 0)

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
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-muted-foreground">
            Track your earnings and manage payouts
          </p>
        </div>
        <Button onClick={requestPayout} disabled={pendingAmount === 0}>
          <CreditCard className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalEarned.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${pendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for payout
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${thisMonthEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              15%
            </div>
            <p className="text-xs text-muted-foreground">
              Per qualified lead
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commissions">Commission History</TabsTrigger>
          <TabsTrigger value="payouts">Payout Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>
                View all your commission earnings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by lead ID or commission type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {filteredCommissions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No commissions yet</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No commissions match your search criteria.' : 'Submit leads to start earning commissions.'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Payout Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommissions.map((commission) => (
                        <TableRow key={commission.id}>
                          <TableCell className="font-mono text-sm">
                            {commission.lead_id}
                          </TableCell>
                          <TableCell className="capitalize">
                            {commission.commission_type?.replace('_', ' ')}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${parseFloat(commission.amount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(commission.status)}
                              <Badge variant={getStatusBadgeVariant(commission.status)}>
                                {commission.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(commission.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {commission.payout_date ? 
                              new Date(commission.payout_date).toLocaleDateString() : 
                              '-'
                            }
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
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>
                Track your payout requests and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payout requests</h3>
                <p className="text-muted-foreground mb-4">
                  Request a payout when you have pending commissions
                </p>
                {pendingAmount > 0 && (
                  <Button onClick={requestPayout}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Request Payout (${pendingAmount.toFixed(2)})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
          <CardDescription>
            How you earn commissions on the Agnus Link platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Direct Lead Commissions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Qualified Lead</span>
                  <span className="font-medium">$50</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold Lead</span>
                  <span className="font-medium">$150</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Referral Commissions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Level 1 (Direct Referrals)</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 2 (Sub-referrals)</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommissionsPage

