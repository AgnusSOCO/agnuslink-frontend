import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Sparkles, 
  Copy, 
  Download,
  RefreshCw,
  FileText,
  Mail,
  MessageSquare,
  Megaphone
} from 'lucide-react'

const AIContentGenerator = () => {
  const { token, API_BASE_URL } = useAuth()
  const [contentType, setContentType] = useState('social_media_post')
  const [targetAudience, setTargetAudience] = useState('homeowners')
  const [leadType, setLeadType] = useState('solar')
  const [generatedContent, setGeneratedContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastGenerated, setLastGenerated] = useState(null)

  const contentTypes = [
    { value: 'social_media_post', label: 'Social Media Post', icon: MessageSquare },
    { value: 'email_template', label: 'Email Template', icon: Mail },
    { value: 'blog_post', label: 'Blog Post', icon: FileText },
    { value: 'ad_copy', label: 'Advertisement Copy', icon: Megaphone }
  ]

  const audiences = [
    { value: 'homeowners', label: 'Homeowners' },
    { value: 'business_owners', label: 'Business Owners' },
    { value: 'seniors', label: 'Senior Citizens' },
    { value: 'young_professionals', label: 'Young Professionals' },
    { value: 'families', label: 'Families with Children' },
    { value: 'eco_conscious', label: 'Environmentally Conscious' }
  ]

  const leadTypes = [
    { value: 'solar', label: 'Solar Installation' },
    { value: 'roofing', label: 'Roofing Services' },
    { value: 'hvac', label: 'HVAC Systems' },
    { value: 'windows', label: 'Window Replacement' },
    { value: 'insulation', label: 'Home Insulation' },
    { value: 'flooring', label: 'Flooring Installation' },
    { value: 'kitchen_remodel', label: 'Kitchen Remodeling' },
    { value: 'bathroom_remodel', label: 'Bathroom Remodeling' }
  ]

  const generateContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_type: contentType,
          target_audience: targetAudience,
          lead_type: leadType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
        setLastGenerated(new Date())
      } else {
        const errorData = await response.json()
        console.error('Error generating content:', errorData)
        setGeneratedContent('Sorry, there was an error generating content. Please try again.')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      setGeneratedContent('Sorry, there was an error generating content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const downloadContent = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${contentType}_${leadType}_${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getContentTypeIcon = (type) => {
    const contentTypeObj = contentTypes.find(ct => ct.value === type)
    if (contentTypeObj) {
      const IconComponent = contentTypeObj.icon
      return <IconComponent className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI Content Generator</span>
          </CardTitle>
          <CardDescription>
            Generate professional marketing content tailored to your audience and lead type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-type">Service Type</Label>
              <Select value={leadType} onValueChange={setLeadType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={generateContent} 
              disabled={loading}
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getContentTypeIcon(contentType)}
                <span>Generated {contentTypes.find(ct => ct.value === contentType)?.label}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadContent}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={generateContent} disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </CardTitle>
            {lastGenerated && (
              <CardDescription>
                Generated on {lastGenerated.toLocaleString()} for {audiences.find(a => a.value === targetAudience)?.label} interested in {leadTypes.find(lt => lt.value === leadType)?.label}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Generated content will appear here..."
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Content Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700">Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Always personalize content for your specific audience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include clear calls-to-action in your content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Test different versions to see what works best</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep your brand voice consistent across all content</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Content Types Guide</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Social Media:</strong> Short, engaging, visual-friendly</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Email:</strong> Personal, value-driven, clear CTA</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Blog Post:</strong> Informative, SEO-optimized, detailed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Megaphone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Ad Copy:</strong> Compelling, benefit-focused, urgent</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIContentGenerator

