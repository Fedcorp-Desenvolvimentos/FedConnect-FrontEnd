import React, { useState, useMemo } from 'react';
import { FiChevronDown, FiChevronUp, FiCalendar, FiUser, FiMapPin } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import * as S from '../ComercialStyles';

function toBRDate(d) {
  try {
    if (!d) return "N/A";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return String(d);
  }
}

function getComercialName(v) {
  const r = v?.responsavel;
  if (!r) return "";
  return r.nome_completo || r.username || r.nome || "";
}

function normalizeStatus(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (s.includes("agend")) return "agendadas";
  if (s.includes("realiz") || s.includes("feito") || s.includes("conclu")) return "realizadas";
  if (s.includes("cancel")) return "canceladas";
  return "outras";
}

function groupByStatus(visitas) {
  const groups = { agendadas: [], realizadas: [], canceladas: [], outras: [] };
  (visitas || []).forEach((v) => {
    const key = normalizeStatus(v.status);
    (groups[key] || groups.outras).push(v);
  });
  return groups;
}

function StatusPill({ status }) {
  const st = normalizeStatus(status);
  const labels = {
    agendadas: "Agendada",
    realizadas: "Realizada",
    canceladas: "Cancelada"
  };
  return <S.StatusPill $status={st}>{labels[st] || status || "—"}</S.StatusPill>;
}

export default function MobileAccordionVisitas({ visitas, onCardClick }) {
  const groups = useMemo(() => groupByStatus(visitas), [visitas]);
  const [openKey, setOpenKey] = useState("agendadas");

  const sections = [
    { key: "agendadas", title: `Agendadas (${groups.agendadas.length})`, icon: "📅" },
    { key: "realizadas", title: `Realizadas (${groups.realizadas.length})`, icon: "✅" },
    { key: "canceladas", title: `Canceladas (${groups.canceladas.length})`, icon: "❌" },
  ];

  return (
    <S.AccordionContainer>
      {sections.map((sec) => (
        <S.AccordionItem key={sec.key}>
          <S.AccordionHeader
            $isOpen={openKey === sec.key}
            onClick={() => setOpenKey((k) => (k === sec.key ? "" : sec.key))}
          >
            <S.AccordionHeaderLeft>
              <span>{sec.icon}</span>
              <span>{sec.title}</span>
            </S.AccordionHeaderLeft>
            <S.AccordionChevron>
              {openKey === sec.key ? <FiChevronUp /> : <FiChevronDown />}
            </S.AccordionChevron>
          </S.AccordionHeader>

          <S.AccordionContent $isOpen={openKey === sec.key}>
            {groups[sec.key].length === 0 ? (
              <S.EmptyMessage>Sem registros</S.EmptyMessage>
            ) : (
              <S.AccordionList>
                {groups[sec.key].map((v) => (
                  <S.AccordionCard key={v.id} onClick={() => onCardClick?.(v)}>
                    <S.CardTitle>
                      <FaBuilding />
                      <span>{v?.empresa || "—"}</span>
                    </S.CardTitle>
                    <S.CardInfo>
                      <span>
                        <FiCalendar size={12} />
                        {toBRDate(v?.data)}
                      </span>
                      <span>
                        <FiUser size={12} />
                        {getComercialName(v) || "Sem responsável"}
                      </span>
                    </S.CardInfo>
                    <S.CardStatus>
                      <StatusPill status={v?.status} />
                    </S.CardStatus>
                  </S.AccordionCard>
                ))}
              </S.AccordionList>
            )}
          </S.AccordionContent>
        </S.AccordionItem>
      ))}
    </S.AccordionContainer>
  );
}