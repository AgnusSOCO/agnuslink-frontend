import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Lightbulb,
  Zap
} from 'lucide-react'

const AILeadAnalyzer = ({ leadId, leadData, onAnalysisComplete }) => {
  const { token, API_BASE_URL } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis')

  const analyzeLead = async () => {
    setLoading(true)
    try {
      // Get lead analysis
      const analysisResponse = await fetch(`${API_BASE_URL}/ai/analyze-lead/${leadId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json()
        setAnalysis(analysisData.analysis)
      }

      // Get follow-up suggestions
      const suggestionsResponse = await fetch(`${API_BASE_URL}/ai/follow-up-suggestions/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json()
        setSuggestions(suggestionsData.suggestions)
      }

      // Get conversion prediction
      const predictionResponse = await fetch(`${API_BASE_URL}/ai/conversion-prediction/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (predictionResponse.ok) {
        const predictionData = await predictionResponse.json()
        setPrediction(predictionData.prediction)
      }

      if (onAnalysisComplete) {
        onAnalysisComplete()
      }
    } catch (error) {
      console.error('Error analyzing lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <TrendingUp className="h-5 w-5 text-blue-600" />
    if (score >= 40) return <Target className="h-5 w-5 text-yellow-600" />
    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  const getQualityBadgeVariant = (quality) => {
    switch (quality) {
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!analysis && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Lead Analysis</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered insights about this lead's quality and conversion potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Analyze this lead to get quality scoring, follow-up suggestions, and conversion predictions
            </p>
            <Button onClick={analyzeLead}>
              <Zap className="mr-2 h-4 w-4" />
              Analyze Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Lead Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Analyzing lead...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'analysis' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Quality Analysis
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'suggestions' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Follow-up Tips
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'prediction' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Conversion Prediction
        </button>
      </div>

      {/* Quality Analysis Tab */}
      {activeTab === 'analysis' && analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Lead Quality Analysis</span>
              </div>
              <Button variant="outline" size="sm" onClick={analyzeLead}>
                <Zap className="mr-2 h-4 w-4" />
                Re-analyze
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="flex items-center space-x-4">
              {getScoreIcon(analysis.score)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Quality Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </span>
                </div>
                <Progress value={analysis.score} className="h-2" />
              </div>
              <Badge variant={getQualityBadgeVariant(analysis.quality_level)}>
                {analysis.quality_level} Quality
              </Badge>
            </div>

            {/* Conversion Probability */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Conversion Probability</h4>
              <p className="text-blue-800">{analysis.conversion_probability}</p>
            </div>

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span>Recommendations</span>
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {analysis.red_flags && analysis.red_flags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Red Flags</span>
                </h4>
                <div className="space-y-2">
                  {analysis.red_flags.map((flag, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {analysis.next_steps && analysis.next_steps.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>Next Steps</span>
                </h4>
                <div className="space-y-2">
                  {analysis.next_steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Follow-up Suggestions Tab */}
      {activeTab === 'suggestions' && suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <span>AI Follow-up Suggestions</span>
            </CardTitle>
            <CardDescription>
              Personalized recommendations for following up with this lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-900">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Prediction Tab */}
      {activeTab === 'prediction' && prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Conversion Prediction</span>
            </CardTitle>
            <CardDescription>
              AI-powered timeline and probability analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prediction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Predicted Timeline</h4>
                <p className="text-2xl font-bold text-purple-800">
                  {prediction.predicted_conversion_days} days
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Conversion Probability</h4>
                <p className="text-2xl font-bold text-green-800">
                  {prediction.conversion_probability}
                </p>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="flex items-center space-x-3">
              <span className="font-medium">Urgency Level:</span>
              <Badge variant="outline" className={getUrgencyColor(prediction.urgency_level)}>
                {prediction.urgency_level} Priority
              </Badge>
            </div>

            {/* Follow-up Schedule */}
            {prediction.optimal_follow_up_schedule && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>Optimal Follow-up Schedule</span>
                </h4>
                <div className="space-y-2">
                  {prediction.optimal_follow_up_schedule.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            {prediction.reasoning && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">AI Reasoning</h4>
                <p className="text-sm text-gray-700">{prediction.reasoning}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AILeadAnalyzer

