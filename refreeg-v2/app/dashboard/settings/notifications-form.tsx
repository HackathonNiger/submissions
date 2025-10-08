"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NotificationsForm() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState<boolean | null>(null)
  const [showDisableInstructions, setShowDisableInstructions] = useState(false)

  useEffect(() => {
    setIsSupported("Notification" in window)
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const handleEnableNotifications = async () => {
    if (!isSupported) return
    
    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === "granted") {
      toast({
        title: "Notifications enabled",
        description: "You'll receive browser notifications",
      })
    } else {
      toast({
        title: "Permission denied",
        description: "Enable Notifications in your browser",
        variant: "destructive",
      })
    }
  }

  const handleDisableClick = () => {
    setShowDisableInstructions(true)
  }

  if (isSupported === null) {
    return null
  }

  if (!isSupported) {
    return (
      <div className="space-y-2">
        <Label>Browser Notifications</Label>
        <p className="text-sm text-muted-foreground">
          Notifications not supported in your browser
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {permission === "granted" ? (
          <>
            <Switch
              id="notifications"
              checked={true}
              onCheckedChange={handleDisableClick}
              className={cn(
                "data-[state=checked]:bg-emerald-500",
              )}
            />
            <Label htmlFor="notifications">Enabled</Label>
          </>
        ) : (
          <>
            <Switch
              id="notifications"
              checked={false}
              onCheckedChange={handleEnableNotifications}
              className={cn(
                "data-[state=unchecked]:bg-rose-500"
              )}
            />
            <Label htmlFor="notifications">Enable Notifications</Label>
          </>
        )}
      </div>

      <AlertDialog open={showDisableInstructions} onOpenChange={setShowDisableInstructions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Notifications</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              To disable notifications, please update your browser settings:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find the Notifications setting</li>
                <li>Change it to "Block" or "Deny"</li>
              </ol>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>I Understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}