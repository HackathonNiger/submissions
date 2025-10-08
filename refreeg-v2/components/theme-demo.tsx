import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";

export function ThemeDemo() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Refreeg Theme Preview</h2>
          <p className="text-muted-foreground">
            This page demonstrates the Refreeg theme with white as primary and
            navy blue (#003366) as secondary.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Toggle Theme</h3>
          <ThemeToggle />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Brand Colors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md bg-primary border border-secondary"></div>
              <p className="text-sm font-medium">Primary (White)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md bg-secondary"></div>
              <p className="text-sm font-medium">Secondary (Navy #003366)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md bg-accent"></div>
              <p className="text-sm font-medium">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md bg-muted"></div>
              <p className="text-sm font-medium">Muted</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md bg-destructive"></div>
              <p className="text-sm font-medium">Destructive</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-md border"></div>
              <p className="text-sm font-medium">Border</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Typography</h3>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <p className="text-base">
              Regular paragraph text. Refreeg is a donation platform that
              connects donors with meaningful causes.
            </p>
            <p className="text-sm text-muted-foreground">
              This is smaller muted text often used for descriptions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Components</h3>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Buttons</h4>
            <div className="flex flex-wrap gap-4">
              <Button>Default (Navy)</Button>
              <Button variant="primary">Primary (White)</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Badges</h4>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="brand">Brand</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Card</h4>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Form Elements</h4>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="account"
                  className="p-4 border rounded-md mt-2"
                >
                  Account settings
                </TabsContent>
                <TabsContent
                  value="password"
                  className="p-4 border rounded-md mt-2"
                >
                  Password settings
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
