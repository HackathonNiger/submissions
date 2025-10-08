"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"

interface UserSearchProps {
    defaultValue?: string
}

export function UserSearch({ defaultValue }: UserSearchProps) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('search', value)
        } else {
            params.delete('search')
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <form className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                name="search"
                placeholder="Search users..."
                className="pl-8"
                defaultValue={defaultValue}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </form>
    )
} 