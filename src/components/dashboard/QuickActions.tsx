"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { predictAttendance } from "@/lib/calculations";
import { Calculator, Plus } from "lucide-react";
import type { AttendanceStatus } from "@/types";

interface QuickActionsProps {
  onOpenForm: (status?: AttendanceStatus) => void;
  currentPercentage: number;
  currentTotal: number;
}

export function QuickActions({
  onOpenForm,
  currentPercentage,
  currentTotal,
}: QuickActionsProps) {
  const [inputPct, setInputPct] = useState(String(currentPercentage));
  const [inputTotal, setInputTotal] = useState(String(currentTotal));
  const [prediction, setPrediction] = useState<ReturnType<
    typeof predictAttendance
  > | null>(null);

  const runPrediction = () => {
    const pct = parseFloat(inputPct);
    const total = parseInt(inputTotal, 10);
    if (isNaN(pct) || isNaN(total) || total < 0) return;
    setPrediction(predictAttendance(pct, total));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <Button variant="success" onClick={() => onOpenForm("PRESENT")}>
            <Plus className="h-4 w-4" /> Present
          </Button>
          <Button variant="danger" onClick={() => onOpenForm("ABSENT")}>
            <Plus className="h-4 w-4" /> Absent
          </Button>
          <Button variant="warning" onClick={() => onOpenForm("OD")}>
            <Plus className="h-4 w-4" /> OD
          </Button>
          <Button variant="primary" onClick={() => onOpenForm()}>
            <Plus className="h-4 w-4" /> Add Entry
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Smart Prediction
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Current Attendance %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={inputPct}
                onChange={(e) => setInputPct(e.target.value)}
              />
            </div>
            <div>
              <Label>Current Total Classes</Label>
              <Input
                type="number"
                min="0"
                value={inputTotal}
                onChange={(e) => setInputTotal(e.target.value)}
              />
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={runPrediction}>
            Calculate
          </Button>
          {prediction && (
            <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800/50 space-y-1">
              <p className="text-zinc-700 dark:text-zinc-300">{prediction.message}</p>
              {prediction.canMiss > 0 && (
                <p className="text-emerald-600 dark:text-emerald-400">
                  Can miss: {prediction.canMiss} more class
                  {prediction.canMiss !== 1 ? "es" : ""}
                </p>
              )}
              {prediction.needToAttend > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  Need to attend: {prediction.needToAttend} consecutive class
                  {prediction.needToAttend !== 1 ? "es" : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
