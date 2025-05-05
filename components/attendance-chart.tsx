"use client"

import { useState } from "react"

export function AttendanceChart() {
  const [chartData] = useState({
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    present: [96.2, 94.8, 97.1, 95.5, 93.2, 89.1],
    absent: [3.8, 5.2, 2.9, 4.5, 6.8, 10.9],
  })

  const maxValue = Math.max(...chartData.present)

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="space-y-6 px-4">
        {chartData.labels.map((day, index) => (
          <div key={day} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{day}</span>
              <div className="text-right">
                <span className="text-lg font-bold text-[#2B468B]">{chartData.present[index]}%</span>
                <p className="text-xs text-gray-500">{chartData.absent[index]}% absents</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-[#2B468B] to-[#4F6EC7] h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${chartData.present[index]}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-4 flex items-center">
                <div
                  className="bg-red-400 h-4 rounded-r-full"
                  style={{ width: `${(chartData.absent[index] / 100) * 400}px` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-[#2B468B] to-[#4F6EC7] rounded-full"></div>
          <span className="text-sm text-gray-600 font-medium">Présents</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded-full"></div>
          <span className="text-sm text-gray-600 font-medium">Absents</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Moyenne hebdomadaire</p>
            <p className="text-xs text-blue-700">Taux de présence global</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">94.8%</p>
            <p className="text-xs text-blue-600">+2.1% vs semaine dernière</p>
          </div>
        </div>
      </div>
    </div>
  )
}
