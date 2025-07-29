import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Copy, 
  Share2, 
  TrendingUp,
  DollarSign,
  UserPlus,
  Network,
  CheckCircle
} from 'lucide-react'

const ReferralsPage = () => {
  const { user, token, API_BASE_URL } = useAuth()
  const [referralStats, setReferralStats] = useState(null)
  const [referralTree, setReferralTree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const [statsResponse, treeResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/users/referrals/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/users/referrals/tree`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setReferralStats(statsData.stats)
      }

      if (treeResponse.ok) {
        const treeData = await treeResponse.json()
        setReferralTree(treeData.tree)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user?.referral_code)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy referral code:', error)
    }
  }

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`
    if (navigator.share) {
      navigator.share({
        title: 'Join Agnus Link',
        text: 'Join me on Agnus Link affiliate portal!',
        url: referralLink
      })
    } else {
      navigator.clipboard.writeText(referralLink)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const ReferralTreeNode = ({ node, level = 0 }) => {
    const marginLeft = level * 40

    return (
      <div className="space-y-2">
        <div 
          className="flex items-center space-x-3 p-3 bg-white rounded-lg border shadow-sm"
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {node.name}
              </p>
              {level === 0 && (
                <Badge variant="outline">You</Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{node.total_leads} leads</span>
              <span>${node.total_earnings?.toFixed(2) || '0.00'} earned</span>
              <span>Joined {new Date(node.joined_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="secondary">
              Level {level + 1}
            </Badge>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="space-y-2">
            {node.children.map((child, index) => (
              <ReferralTreeNode 
                key={child.id} 
                node={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Referral Network</h1>
          <p className="text-muted-foreground">
            Manage your referrals and track your network growth
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats?.total_referrals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Direct referrals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {referralStats?.active_referrals || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              With submitted leads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${referralStats?.total_commission_from_referrals?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              From referral commissions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Levels</CardTitle>
            <Network className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {referralStats?.levels ? Math.max(
                referralStats.levels.level_1 > 0 ? 1 : 0,
                referralStats.levels.level_2 > 0 ? 2 : 0
              ) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active levels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Your Referral Code</span>
          </CardTitle>
          <CardDescription>
            Share this code with others to earn referral commissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="referral-code">Referral Code</Label>
              <div className="flex mt-1">
                <Input
                  id="referral-code"
                  value={user?.referral_code || ''}
                  readOnly
                  className="font-mono text-lg"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={copyReferralCode}
                >
                  {copySuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="referral-link">Referral Link</Label>
              <div className="flex mt-1">
                <Input
                  id="referral-link"
                  value={`${window.location.origin}/register?ref=${user?.referral_code}`}
                  readOnly
                  className="text-sm"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={shareReferralLink}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="tree" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tree">Network Tree</TabsTrigger>
          <TabsTrigger value="levels">Level Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Network Tree</CardTitle>
              <CardDescription>
                Visual representation of your referral network
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralTree ? (
                <div className="space-y-4">
                  <ReferralTreeNode node={referralTree} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your network by sharing your referral code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="levels" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Level 1 (Direct Referrals)</CardTitle>
                <CardDescription>
                  People you directly referred
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {referralStats?.levels?.level_1 || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Direct referrals in your network
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Level 2 (Sub-referrals)</CardTitle>
                <CardDescription>
                  People referred by your referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {referralStats?.levels?.level_2 || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Second-level referrals in your network
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReferralsPage

