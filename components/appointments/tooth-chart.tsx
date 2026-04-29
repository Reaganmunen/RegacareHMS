"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type ToothState = "healthy" | "caries" | "treated" | "missing"

export type ToothChartData = Record<number, ToothState>

interface ToothChartProps {
  value?: ToothChartData
  onChange?: (data: ToothChartData) => void
  readonly?: boolean
}

type MarkMode = "caries" | "treated" | "missing" | null

// FDI upper: right 18→11, left 21→28
// FDI lower: right 48→41, left 31→38
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38]

const STATE_COLORS: Record<ToothState, string> = {
  healthy:  "bg-white border-gray-300 hover:border-gray-400",
  caries:   "bg-orange-100 border-orange-400",
  treated:  "bg-emerald-100 border-emerald-400",
  missing:  "bg-rose-100   border-rose-400",
}

const LEGEND = [
  { state: "healthy" as ToothState,  label: "Healthy",            color: "bg-white border border-gray-300" },
  { state: "caries"  as ToothState,  label: "Caries",             color: "bg-orange-100 border border-orange-400" },
  { state: "treated" as ToothState,  label: "Treated",            color: "bg-emerald-100 border border-emerald-400" },
  { state: "missing" as ToothState,  label: "Missing / Extracted",color: "bg-rose-100 border border-rose-400" },
]

function Tooth({
  number,
  state,
  onClick,
  readonly,
}: {
  number: number
  state: ToothState
  onClick: () => void
  readonly?: boolean
}) {
  return (
    <button
      type="button"
      disabled={readonly}
      onClick={onClick}
      title={`Tooth ${number} — ${state}`}
      className={cn(
        "w-9 h-10 rounded-md border-2 flex flex-col items-center justify-center gap-0.5 transition-all text-[10px] font-semibold text-gray-500 select-none",
        STATE_COLORS[state],
        !readonly && "cursor-pointer hover:scale-105 active:scale-95",
        readonly && "cursor-default"
      )}
    >
      {number}
    </button>
  )
}

export function ToothChart({ value, onChange, readonly }: ToothChartProps) {
  const [teeth, setTeeth] = useState<ToothChartData>(value ?? {})
  const [markMode, setMarkMode] = useState<MarkMode>(null)

  const getState = (n: number): ToothState => teeth[n] ?? "healthy"

  const handleToothClick = (n: number) => {
    if (readonly || !markMode) return
    const next: ToothChartData = {
      ...teeth,
      [n]: markMode,
    }
    setTeeth(next)
    onChange?.(next)
  }

  const handleClear = () => {
    setTeeth({})
    onChange?.({})
  }

  const modeBtn = (mode: MarkMode, label: string, activeClass: string) => (
    <button
      type="button"
      onClick={() => setMarkMode(markMode === mode ? null : mode)}
      className={cn(
        "px-4 py-1.5 rounded-md border text-sm font-medium transition-all",
        markMode === mode
          ? activeClass
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  )

  const renderRow = (teeth: number[]) =>
    teeth.map((n) => (
      <Tooth
        key={n}
        number={n}
        state={getState(n)}
        onClick={() => handleToothClick(n)}
        readonly={readonly}
      />
    ))

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      {!readonly && (
        <div className="flex flex-wrap items-center gap-2">
          {modeBtn("caries",  "Mark Caries",  "border-orange-400 bg-orange-50 text-orange-700")}
          {modeBtn("treated", "Mark Treated", "border-emerald-500 bg-emerald-600 text-white")}
          {modeBtn("missing", "Mark Missing", "border-rose-400 bg-rose-50 text-rose-700")}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1.5 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Clear
          </button>
          {markMode && (
            <span className="text-xs text-gray-400 italic ml-1">
              Click a tooth to mark as <span className="font-semibold text-gray-600">{markMode}</span>
            </span>
          )}
        </div>
      )}

      {/* Chart grid */}
      <div className="overflow-x-auto">
        <div className="min-w-140 space-y-1">
          {/* Upper */}
          <p className="text-xs text-center text-gray-400 font-medium tracking-widest uppercase mb-1">
            Upper Right → Upper Left
          </p>
          <div className="flex justify-center gap-1">
            {renderRow(UPPER_RIGHT)}
            <div className="w-px bg-gray-200 mx-1" />
            {renderRow(UPPER_LEFT)}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-2" />

          {/* Lower */}
          <div className="flex justify-center gap-1">
            {renderRow(LOWER_RIGHT)}
            <div className="w-px bg-gray-200 mx-1" />
            {renderRow(LOWER_LEFT)}
          </div>
          <p className="text-xs text-center text-gray-400 font-medium tracking-widest uppercase mt-1">
            Lower Right → Lower Left
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-1">
        {LEGEND.map(({ state, label, color }) => (
          <div key={state} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={cn("w-4 h-4 rounded-sm inline-block", color)} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}