import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionStatusProps {
  active: boolean;
  email?: string;
  plan?: string;
}

export function SubscriptionStatus({ active, email, plan }: SubscriptionStatusProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Subscription Access</CardTitle>
        <CardDescription>
          Access is controlled with an `ach_access` HTTP-only cookie after checkout validation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge className={active ? "border-[#3e6e35] bg-[#1d3b1a] text-[#9be15d]" : "border-[#5a3540] bg-[#2f1820] text-[#f5a6b6]"}>
          {active ? "Active" : "Locked"}
        </Badge>
        <div className="space-y-1 text-sm text-[#9fb1cc]">
          <p>{active ? `Plan: ${plan ?? "pro"}` : "Plan: unlock required"}</p>
          <p>{email ? `Account: ${email}` : "Account: not authenticated"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
