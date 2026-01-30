import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          تنظیمات
        </h1>
        <p className="text-muted-foreground">تنظیمات حساب کاربری و اعلان‌ها</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>تنظیمات اعلان‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            تنظیمات اعلان‌ها به زودی اضافه خواهد شد.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>امنیت</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            تنظیمات امنیتی به زودی اضافه خواهد شد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
