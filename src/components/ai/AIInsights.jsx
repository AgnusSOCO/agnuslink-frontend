import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Sparkles
} from 'lucide-react'

const AIInsights = ({ userId, showPerformanceAnalysis = true }) => {
  const { token, API_BASE_URL } = useAuth()
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState(null)

  useEffect(() => {
    if (showPerformanceAnalysis) {
      fetchPerformanceAnalysis()
    }
  }, [showPerformanceAnalysis])

  const fetchPerformanceAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ai/performance-analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPerformanceAnalysis(data.analysis)
        setLastAnalyzed(new Date())
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (rating) => {
    switch (rating) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'average':
        return 'text-yellow-600'
      case 'needs_improvement':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPerformanceIcon = (rating) => {
    switch (rating) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'good':
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'average':
        return <Target className="h-5 w-5 text-yellow-600" />
      case 'needs_improvement':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Analyzing your performance...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!performanceAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Performance Insights</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered insights about your affiliate performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized insights and recommendations to improve your performance
            </p>
            <Button onClick={fetchPerformanceAnalysis}>
              <Brain className="mr-2 h-4 w-4" />
              Analyze My Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Performance Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Performance Analysis</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPerformanceAnalysis}
              disabled={loading}
            >
              <Zap className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            AI-powered insights based on your affiliate activity
            {lastAnalyzed && (
              <span className="block text-xs text-muted-foreground mt-1">
                Last analyzed: {lastAnalyzed.toLocaleString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 mb-6">
            {getPerformanceIcon(performanceAnalysis.performance_rating)}
            <div>
              <h3 className={`text-lg font-semibold capitalize ${getPerformanceColor(performanceAnalysis.performance_rating)}`}>
                {performanceAnalysis.performance_rating?.replace('_', ' ')} Performance
              </h3>
              <p className="text-sm text-muted-foreground">
                Predicted monthly potential: {performanceAnalysis.predicted_monthly_potential}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Strengths</span>
              </h4>
              <div className="space-y-2">
                {performanceAnalysis.strengths?.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-700 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Areas for Improvement</span>
              </h4>
              <div className="space-y-2">
                {performanceAnalysis.improvement_areas?.map((area, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span>AI Recommendations</span>
          </CardTitle>
          <CardDescription>
            Personalized suggestions to boost your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceAnalysis.recommendations?.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Growth Opportunities</span>
          </CardTitle>
          <CardDescription>
            Potential areas for expanding your affiliate business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceAnalysis.growth_opportunities?.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-purple-900">{opportunity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIInsights

