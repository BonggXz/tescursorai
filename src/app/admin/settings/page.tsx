'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: '',
    heroTitle: '',
    heroSubtitle: '',
    primaryColor: '#2563EB',
    socials: {
      discord: '',
      whatsapp: '',
      youtube: '',
      x: '',
    },
  })

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          siteName: data.siteName,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          primaryColor: data.primaryColor,
          socials: JSON.parse(data.socials || '{}'),
        })
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to update settings')

      toast({
        title: 'Success',
        description: 'Settings updated successfully!',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update settings',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="site">
          <TabsList className="mb-4">
            <TabsTrigger value="site">Site Settings</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    />
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="h-10 w-20 rounded border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discord">Discord URL</Label>
                  <Input
                    id="discord"
                    type="url"
                    placeholder="https://discord.gg/example"
                    value={settings.socials.discord}
                    onChange={(e) => setSettings({
                      ...settings,
                      socials: { ...settings.socials, discord: e.target.value },
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp URL</Label>
                  <Input
                    id="whatsapp"
                    type="url"
                    placeholder="https://wa.me/1234567890"
                    value={settings.socials.whatsapp}
                    onChange={(e) => setSettings({
                      ...settings,
                      socials: { ...settings.socials, whatsapp: e.target.value },
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/@example"
                    value={settings.socials.youtube}
                    onChange={(e) => setSettings({
                      ...settings,
                      socials: { ...settings.socials, youtube: e.target.value },
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="x">X (Twitter) URL</Label>
                  <Input
                    id="x"
                    type="url"
                    placeholder="https://x.com/example"
                    value={settings.socials.x}
                    onChange={(e) => setSettings({
                      ...settings,
                      socials: { ...settings.socials, x: e.target.value },
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
