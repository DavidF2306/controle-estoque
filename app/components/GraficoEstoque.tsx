"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function GraficoEstoque() {

  const data = [
    {
      dia: "01/06",
      entradas: 5,
      saidas: 2,
    },
    {
      dia: "02/06",
      entradas: 8,
      saidas: 4,
    },
    {
      dia: "03/06",
      entradas: 3,
      saidas: 6,
    },
    {
      dia: "04/06",
      entradas: 10,
      saidas: 5,
    },
    {
      dia: "05/06",
      entradas: 7,
      saidas: 3,
    },
  ];

  return (

    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

      <h2 className="text-2xl font-bold mb-6">
        Movimentações por Dia
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="dia" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="entradas"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="saidas"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}