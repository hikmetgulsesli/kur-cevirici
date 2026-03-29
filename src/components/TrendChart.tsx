import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
  baseCurrency?: string;
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  value: number;
}

// Generate mock 7-day trend data
function generateTrendData(currency: string): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  
  // Base values per currency (against TRY)
  const baseValues: Record<string, number> = {
    BTC: 4500000,
    ETH: 280000,
    USD: 38.50,
    EUR: 41.20,
    GBP: 48.90,
  };
  
  const base = baseValues[currency] || 1000;
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic-looking variation (-5% to +5%)
    const variation = 1 + (Math.sin(i * 1.5 + currency.charCodeAt(0) * 0.1) * 0.05);
    const value = base * variation;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    data.push({
      date: `${day}.${month}`,
      fullDate: date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
}

const CURRENCIES = ['BTC', 'ETH', 'USD', 'EUR', 'GBP'] as const;
type CurrencyType = typeof CURRENCIES[number];

const CURRENCY_LABELS: Record<CurrencyType, string> = {
  BTC: 'BTC',
  ETH: 'ETH',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
};

interface CustomTooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
  chartData: ChartDataPoint[];
}

function CustomTooltip({ active, payload, label, chartData }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !label) {
    return null;
  }
  
  const dataPoint = chartData.find(d => d.date === label);
  
  return (
    <div className="chart-tooltip">
      <div className="tooltip-date">{dataPoint?.fullDate || label}</div>
      <div className="tooltip-value">{payload[0].value.toLocaleString('tr-TR')}</div>
    </div>
  );
}

export function TrendChart({ baseCurrency = 'BTC' }: TrendChartProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(
    (CURRENCIES.includes(baseCurrency as CurrencyType) ? baseCurrency : 'BTC') as CurrencyType
  );
  
  const data = useMemo(() => generateTrendData(selectedCurrency), [selectedCurrency]);
  
  const handleCurrencyChange = (currency: CurrencyType) => {
    setSelectedCurrency(currency);
  };
  
  return (
    <div className="trend-chart-container">
      <header className="trend-chart-header">
        <h2 className="trend-chart-title">7 Gunluk Trend</h2>
        <div className="currency-tabs" role="tablist" aria-label="Para birimi seçimi">
          {CURRENCIES.map((currency) => (
            <button
              key={currency}
              type="button"
              role="tab"
              aria-selected={selectedCurrency === currency}
              className={`currency-tab ${selectedCurrency === currency ? 'active' : ''}`}
              onClick={() => handleCurrencyChange(currency)}
            >
              {CURRENCY_LABELS[currency]}
            </button>
          ))}
        </div>
      </header>
      
      <div className="chart-wrapper" role="tabpanel" aria-label={`${selectedCurrency} 7 gunluk trend grafigi`}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip chartData={data} />}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'var(--primary)',
                stroke: 'var(--surface)',
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
