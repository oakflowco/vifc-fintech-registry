import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CommoditiesPage() {
  const keyStats = [
    { label: "MXV Daily Volume", value: "$500M+", sub: "Average 2025" },
    { label: "Products Traded", value: "28+", sub: "Commodities & derivatives" },
    { label: "Connected Exchanges", value: "4", sub: "CME, ICE, LME, TOCOM" },
    { label: "Trading Accounts", value: "100K+", sub: "And growing" },
  ];

  const products = [
    {
      category: "Agricultural",
      items: [
        { name: "Robusta Coffee", note: "Vietnam is #1 global Robusta producer (40% of world supply)", volume: "Very High" },
        { name: "Arabica Coffee", note: "Growing production in Central Highlands", volume: "High" },
        { name: "Cashew Nuts", note: "Vietnam is #1 global exporter of processed cashews", volume: "Medium" },
        { name: "Rubber", note: "3rd largest producer in the world", volume: "High" },
        { name: "Rice", note: "3rd largest exporter globally, 43M tons/year", volume: "Medium" },
        { name: "Pepper", note: "#1 global exporter of black pepper", volume: "Medium" },
        { name: "Cocoa", note: "Linked to ICE Futures", volume: "Medium" },
        { name: "Sugar (Raw & White)", note: "ICE-linked contracts", volume: "Medium" },
        { name: "Corn / Soybeans / Wheat", note: "CME-linked, feed grain imports", volume: "High" },
      ],
    },
    {
      category: "Metals & Energy",
      items: [
        { name: "Steel (HRC)", note: "Vietnam is ASEAN's largest steel producer (20M+ tons)", volume: "High" },
        { name: "Copper", note: "LME-linked contracts", volume: "Medium" },
        { name: "Tin", note: "Vietnam is a top-10 tin producer", volume: "Medium" },
        { name: "Crude Oil (WTI & Brent)", note: "CME/ICE-linked", volume: "High" },
        { name: "Natural Gas", note: "CME-linked, growing domestic demand", volume: "Medium" },
        { name: "Gold", note: "Domestic spot + international futures", volume: "Low" },
      ],
    },
  ];

  const brokers = [
    { name: "Saigon Futures Inc. (SFC)", license: "MXV Member", hq: "Ho Chi Minh City", website: "saigonfutures.com.vn" },
    { name: "Vincom Futures", license: "MXV Member", hq: "Hanoi", website: "" },
    { name: "An Phong Futures", license: "MXV Member", hq: "Ho Chi Minh City", website: "" },
    { name: "Dai Viet Futures", license: "MXV Member", hq: "Hanoi", website: "" },
    { name: "ACB Futures", license: "MXV Member", hq: "Ho Chi Minh City", website: "" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Commodity Exchange (MXV)</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          The Mercantile Exchange of Vietnam (MXV) is Vietnam&apos;s national commodity exchange,
          trading 28+ products linked to CME, ICE, LME, and TOCOM. Vietnam is a global leader
          in coffee, cashews, pepper, rubber, and rice.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {keyStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-1">{s.label}</div>
              <div className="text-[10px] text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vietnam's Commodity Strengths */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vietnam&apos;s Global Commodity Rankings</CardTitle>
          <CardDescription>Vietnam is a commodity powerhouse — top producer/exporter in multiple categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { commodity: "Robusta Coffee", rank: "#1 Producer", share: "40% of world supply" },
              { commodity: "Cashew Nuts", rank: "#1 Exporter", share: "Processing hub" },
              { commodity: "Black Pepper", rank: "#1 Exporter", share: "60% of global trade" },
              { commodity: "Rice", rank: "#3 Exporter", share: "43M tons/year" },
              { commodity: "Rubber", rank: "#3 Producer", share: "1.3M tons/year" },
              { commodity: "Seafood", rank: "#3 Exporter", share: "$9B+/year" },
              { commodity: "Steel", rank: "#1 in ASEAN", share: "20M+ tons/year" },
              { commodity: "Tin", rank: "Top 10", share: "Growing production" },
            ].map((c) => (
              <div key={c.commodity} className="border rounded-lg p-3">
                <p className="text-sm font-semibold">{c.commodity}</p>
                <Badge variant="default" className="text-[9px] mt-1">{c.rank}</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">{c.share}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Traded Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((cat) => (
            <Card key={cat.category}>
              <CardHeader>
                <CardTitle className="text-base">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.note}</p>
                      </div>
                      <Badge variant={item.volume === "Very High" ? "default" : item.volume === "High" ? "secondary" : "outline"} className="text-[9px] shrink-0">
                        {item.volume}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Licensed Brokers */}
      <Card>
        <CardHeader>
          <CardTitle>Licensed Commodity Brokers</CardTitle>
          <CardDescription>MXV member firms authorized for commodity futures trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2.5 font-medium text-muted-foreground">Broker</th>
                  <th className="text-left py-2.5 font-medium text-muted-foreground">License</th>
                  <th className="text-left py-2.5 font-medium text-muted-foreground">HQ</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((b) => (
                  <tr key={b.name} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{b.name}</td>
                    <td className="py-2.5"><Badge variant="outline" className="text-[10px]">{b.license}</Badge></td>
                    <td className="py-2.5 text-muted-foreground">{b.hq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
