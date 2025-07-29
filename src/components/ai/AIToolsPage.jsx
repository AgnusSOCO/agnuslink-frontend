import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  BarChart3, 
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  FileText
} from 'lucide-react'

import AIInsights from './AIInsights'
import AIContentGenerator from './AIContentGenerator'

const AIToolsPage = () => {
  const [activeTab, setActiveTab] = useState('insights')

  const aiFeatures = [
    {
      icon: BarChart3,
      title: 'Performance Analysis',
      description: 'Get AI-powered insights about your affiliate performance with personalized recommendations',
      cost: '~$0.002 per analysis',
      benefits: ['Performance rating', 'Strengths & weaknesses', 'Growth opportunities', 'Predicted earnings']
    },
    {
      icon: Target,
      title: 'Lead Quality Scoring',
      description: 'Automatically analyze lead quality and get conversion probability predictions',
      cost: '~$0.001 per lead',
      benefits: ['Quality score (1-100)', 'Conversion probability', 'Red flags detection', 'Next steps guidance']
    },
    {
      icon: Lightbulb,
      title: 'Follow-up Suggestions',
      description: 'Get personalized follow-up recommendations based on lead data and status',
      cost: '~$0.001 per suggestion',
      benefits: ['Timing optimization', 'Communication methods', 'Value propositions', 'Conversion strategies']
    },
    {
      icon: Sparkles,
      title: 'Content Generation',
      description: 'Generate professional marketing content for social media, emails, and advertisements',
      cost: '~$0.003 per content',
      benefits: ['Multiple content types', 'Audience targeting', 'Brand compliance', 'Instant generation']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <span>AI Tools</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Powered by GPT
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Boost your affiliate performance with AI-powered insights and automation
          </p>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <feature.icon className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                {feature.cost}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {feature.description}
              </p>
              <div className="space-y-1">
                {feature.benefits.slice(0, 2).map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">{benefit}</span>
                  </div>
                ))}
                {feature.benefits.length > 2 && (
                  <div className="text-xs text-purple-600">
                    +{feature.benefits.length - 2} more features
                  </div>
                )}
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
          </Card>
        ))}
      </div>

      {/* AI Tools Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Performance Insights</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Content Generator</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Smart Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <AIInsights showPerformanceAnalysis={true} />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <AIContentGenerator />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Smart Analytics</span>
                <Badge variant="outline">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>
                Advanced analytics and predictive insights for your affiliate business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-transparent">
                  <h4 className="font-semibold text-blue-900 mb-2">Market Trends Analysis</h4>
                  <p className="text-sm text-blue-700">
                    AI-powered analysis of market trends and seasonal patterns to optimize your lead generation timing
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-transparent">
                  <h4 className="font-semibold text-green-900 mb-2">Competitor Intelligence</h4>
                  <p className="text-sm text-green-700">
                    Analyze competitor strategies and identify opportunities in your market segment
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-transparent">
                  <h4 className="font-semibold text-purple-900 mb-2">Revenue Forecasting</h4>
                  <p className="text-sm text-purple-700">
                    Predict future earnings based on current performance and market conditions
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-transparent">
                  <h4 className="font-semibold text-yellow-900 mb-2">Lead Source Optimization</h4>
                  <p className="text-sm text-yellow-700">
                    Identify the most profitable lead sources and optimize your acquisition strategy
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-gradient-to-br from-red-50 to-transparent">
                  <h4 className="font-semibold text-red-900 mb-2">Risk Assessment</h4>
                  <p className="text-sm text-red-700">
                    Early warning system for potential issues with lead quality or market changes
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-gradient-to-br from-indigo-50 to-transparent">
                  <h4 className="font-semibold text-indigo-900 mb-2">Personalization Engine</h4>
                  <p className="text-sm text-indigo-700">
                    AI-driven personalization for lead communication and follow-up strategies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cost Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>AI Usage & Costs</span>
          </CardTitle>
          <CardDescription>
            Transparent pricing for AI-powered features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700">Cost-Effective AI</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Lead Analysis</span>
                  <Badge variant="outline" className="text-green-700">~$0.001 each</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Performance Insights</span>
                  <Badge variant="outline" className="text-blue-700">~$0.002 each</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Content Generation</span>
                  <Badge variant="outline" className="text-purple-700">~$0.003 each</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700">Value Proposition</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Increase lead conversion rates by up to 25%</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Save 2-3 hours per week on content creation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Improve follow-up timing and effectiveness</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Data-driven insights for better decision making</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIToolsPage

