import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { DoctorSidebar } from "../../sidebars/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Badge } from "../../ui/badge";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import type { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { usePatients } from "../../../contexts/PatientsContext";

const generateMockData = (days: number) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: format(date, "MMM dd"),
      heartRate: 65 + Math.random() * 20,
      systolic: 110 + Math.random() * 30,
      diastolic: 70 + Math.random() * 20,
      temperature: 97.5 + Math.random() * 2,
      bloodSugar: 80 + Math.random() * 40,
    });
  }

  return data;
};

const Analytics = () => {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState("1");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [timeRange, setTimeRange] = useState("7days");

  const getDays = () => {
    switch (timeRange) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      default:
        return 7;
    }
  };

  const analyticsData = generateMockData(getDays());

  const calculateAverage = (key: string) => {
    const values = analyticsData.map((d) => d[key as keyof typeof d] as number);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const calculateTrend = (key: string) => {
    const values = analyticsData.map((d) => d[key as keyof typeof d] as number);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    return secondAvg > firstAvg ? "up" : "down";
  };

  const renderMetricCard = (title: string, key: string, unit: string, normalRange: string) => {
    const avg = calculateAverage(key);
    const trend = calculateTrend(key);
    const latest = analyticsData[analyticsData.length - 1][key as keyof (typeof analyticsData)[0]];

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CardDescription>{normalRange}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{typeof latest === "number" ? latest.toFixed(1) : latest}</div>
                <div className="text-xs text-muted-foreground mt-1">Current</div>
              </div>
              <div className="flex items-center space-x-1">
                {trend === "up" ? <TrendingUp className="h-4 w-4 text-warning" /> : <TrendingDown className="h-4 w-4 text-success" />}
                <span className={`text-sm font-medium ${trend === "up" ? "text-warning" : "text-success"}`}>{trend === "up" ? "↑" : "↓"}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average</span>
                <span className="font-semibold text-foreground">
                  {avg} {unit}
                </span>
              </div>
            </div>

            {/* Mini chart representation */}
            <div className="flex items-end space-x-1 h-12 pt-2">
              {analyticsData.slice(-7).map((data, i) => {
                const value = data[key as keyof typeof data] as number;
                const min = Math.min(...analyticsData.map((d) => d[key as keyof typeof d] as number));
                const max = Math.max(...analyticsData.map((d) => d[key as keyof typeof d] as number));
                const height = ((value - min) / (max - min)) * 100;

                return (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                    style={{ height: `${height}%` }}
                    title={`${format(subDays(new Date(), 6 - i), "MMM dd")}: ${value.toFixed(1)} ${unit}`}
                  />
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider className="w-screen min-h-screen overflow-hidden h-full">
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Patient Analytics</h1>
              <p className="text-sm text-muted-foreground">View and analyze patient vital trends</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 sm:pr-10 pr-10 max-w-6xl mx-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Select Patient</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient: { id: string; name: string }) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time Range</Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Date Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Summary */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Heart Rate", "heartRate", "bpm", "Normal: 60-100 bpm")}
                {renderMetricCard("Blood Pressure (Systolic)", "systolic", "mmHg", "Normal: <120 mmHg")}
                {renderMetricCard("Blood Pressure (Diastolic)", "diastolic", "mmHg", "Normal: <80 mmHg")}
                {renderMetricCard("Temperature", "temperature", "°F", "Normal: 97-99°F")}
                {renderMetricCard("Blood Sugar", "bloodSugar", "mg/dL", "Normal: 70-100 mg/dL")}
              </div>

              {/* Detailed Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Readings</CardTitle>
                  <CardDescription>Complete history of vitals for selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid gap-4 w-full grid-cols-4">
                      <TabsTrigger value="all">All Vitals</TabsTrigger>
                      <TabsTrigger value="heart">Heart & BP</TabsTrigger>
                      <TabsTrigger value="metabolic">Metabolic</TabsTrigger>
                      <TabsTrigger value="physical">Physical</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-4">
                      <div className="rounded-lg border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Heart Rate</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">BP (S/D)</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Temp</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Blood Sugar</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analyticsData
                                .slice(-10)
                                .reverse()
                                .map((data, i) => (
                                  <tr key={i} className="border-t hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-foreground">{data.date}</td>
                                    <td className="px-4 py-3 text-sm text-foreground">{data.heartRate.toFixed(0)} bpm</td>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                      {data.systolic.toFixed(0)}/{data.diastolic.toFixed(0)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground">{data.temperature.toFixed(1)}°F</td>
                                    <td className="px-4 py-3 text-sm text-foreground">{data.bloodSugar.toFixed(0)} mg/dL</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="heart" className="mt-4">
                      <div className="text-center py-8 text-muted-foreground">Heart rate and blood pressure data filtered view</div>
                    </TabsContent>

                    <TabsContent value="metabolic" className="mt-4">
                      <div className="text-center py-8 text-muted-foreground">Blood sugar and temperature data filtered view</div>
                    </TabsContent>

                    <TabsContent value="physical" className="mt-4">
                      <div className="text-center py-8 text-muted-foreground">Weight and physical metrics filtered view</div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Clinical Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Clinical Summary & Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success-light rounded-lg border border-success/20">
                    <div className="flex items-start space-x-3">
                      <Badge className="bg-success text-success-foreground mt-1">Normal</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">Overall Health Status</h4>
                        <p className="text-sm text-muted-foreground">
                          Patient's vital signs are within normal ranges for the selected period. Heart rate and blood pressure show stable trends
                          with minor variations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Key Observations:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Heart rate averaging {calculateAverage("heartRate")} bpm - within normal range</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Blood pressure readings stable at {calculateAverage("systolic")}/{calculateAverage("diastolic")} mmHg
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Temperature consistently normal at {calculateAverage("temperature")}°F</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Blood sugar levels well-controlled averaging {calculateAverage("bloodSugar")} mg/dL</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground italic">
                      Note: This is an automated summary. Please review the detailed data and use clinical judgment for patient care decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
