"use client";

import { UserProvider } from '@/hooks/use-user';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, FileText, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/icons';
import { NewClaimForm } from '@/components/new-claim-form';

function AppSidebar() {
    const pathname = usePathname();
    const { users, currentUser, setCurrentUser } = useUser();

    const handleUserChange = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        }
    }

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M15 4H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M9 4v2"/><path d="M15 4v2"/><path d="M9 14h6"/><path d="M9 18h3"/></svg>
                    </div>
                    <h1 className="text-xl font-headline font-semibold">ClaimWise</h1>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/dashboard">
                            <SidebarMenuButton isActive={pathname === '/dashboard'}><Home />Dashboard</SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <NewClaimForm>
                           <Button variant="ghost" className="w-full justify-start items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8 hover:bg-accent hover:text-accent-foreground"><FileText /> New Claim</Button>
                        </NewClaimForm>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 mt-auto">
                 {currentUser && (
                    <Select value={currentUser.id} onValueChange={handleUserChange}>
                        <SelectTrigger className="w-full">
                           <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="font-semibold text-sm">{currentUser.name}</p>
                                    <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                                </div>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.role}</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SidebarProvider>
                <div className="flex min-h-screen bg-background">
                    <AppSidebar />
                    <SidebarInset>
                         <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
                            <SidebarTrigger className="md:hidden" />
                            {/* Header content can go here if needed */}
                        </header>
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </UserProvider>
    )
}
