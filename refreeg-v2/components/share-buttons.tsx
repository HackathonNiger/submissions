"use client"

import { Button } from "@/components/ui/button"
import { Share2, MessageSquare, Instagram, Twitter, Linkedin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonsProps {
    url: string
    title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const { toast } = useToast()

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url)
        toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
        })
    }

    const handleShare = (platform: string) => {
        let shareUrl = ""
        const encodedUrl = encodeURIComponent(url)
        const encodedTitle = encodeURIComponent(title)

        switch (platform) {
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
                break
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
                break
            case "instagram":
                // Instagram doesn't support direct sharing via URL
                toast({
                    title: "Instagram sharing",
                    description: "Please copy the link and share it on Instagram.",
                })
                return
        }

        window.open(shareUrl, "_blank")
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("whatsapp")}
                className="flex items-center gap-2"
            >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("instagram")}
                className="flex items-center gap-2"
            >
                <Instagram className="h-4 w-4" />
                Instagram
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2"
            >
                <Twitter className="h-4 w-4" />
                X
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2"
            >
                <Linkedin className="h-4 w-4" />
                LinkedIn
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-2"
            >
                <Share2 className="h-4 w-4" />
                Copy Link
            </Button>
        </div>
    )
} 