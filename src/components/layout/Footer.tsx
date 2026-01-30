import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Send, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">اینفلوئنسر مارکت</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              پلتفرم جامع همکاری بین اینفلوئنسرها و صاحبان کسب‌وکار
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/search" className="hover:text-foreground transition-colors">
                  جستجوی اینفلوئنسرها
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-foreground transition-colors">
                  مشاهده کمپین‌ها
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=signup&role=influencer" className="hover:text-foreground transition-colors">
                  ثبت‌نام اینفلوئنسر
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=signup&role=business" className="hover:text-foreground transition-colors">
                  ثبت‌نام کسب‌وکار
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-semibold mb-4">برای کسب‌وکارها</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/how-it-works" className="hover:text-foreground transition-colors">
                  نحوه کار
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  تعرفه‌ها
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-foreground transition-colors">
                  داستان‌های موفقیت
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-foreground transition-colors">
                  راهنما
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© ۱۴۰۴ اینفلوئنسر مارکت. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
