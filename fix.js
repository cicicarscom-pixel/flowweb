const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/page.tsx', 'utf8');

const target = `            {socialStats.trend > 0 ? (
               <> {t.rich('dashboardHome.aiSummary.trendUp', {
                    trend: socialStats.trend,
                    pct: (chunks) => <strong style={{ color: "#F59E0B" }}>{chunks}</strong>,
                  })}</>
            ) : (
               <> {t('dashboardHome.aiSummary.trendAnalyzing')}</>
            )}`;

const replacement = `            {hasSocialAccounts && (
              socialStats.trend > 0 ? (
                 <> {t.rich('dashboardHome.aiSummary.trendUp', {
                      trend: socialStats.trend,
                      pct: (chunks) => <strong style={{ color: "#F59E0B" }}>{chunks}</strong>,
                    })}</>
              ) : (
                 <> {t('dashboardHome.aiSummary.trendAnalyzing')}</>
              )
            )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/app/(dashboard)/page.tsx', content);
