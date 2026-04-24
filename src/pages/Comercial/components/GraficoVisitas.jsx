import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as S from "../ComercialStyles";

export default function GraficoVisitas({ visitas }) {
  const dados = [
    { 
      nome: "Agendadas", 
      valor: visitas.filter(v => v?.status?.toLowerCase() === "agendado").length,
      color: "#f59e0b"
    },
    { 
      nome: "Realizadas", 
      valor: visitas.filter(v => v?.status?.toLowerCase() === "realizada").length,
      color: "#10b981"
    },
    { 
      nome: "Canceladas", 
      valor: visitas.filter(v => v?.status?.toLowerCase() === "cancelada").length,
      color: "#ef4444"
    },
  ];

  return (
    <S.ChartContainer>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={dados}>
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </S.ChartContainer>
  );
}