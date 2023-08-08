import { z } from "zod";
import { Income, IncomeDTO, Rate } from "./types";
import { format } from "date-fns";
// @ts-ignore
import * as XLSX from "xlsjs";

export const parseMonoCsv = (csv: string): IncomeDTO[] => {
  const lines = csv
    .split("\n")
    // cut last empty line
    .filter((it) => it)
    // cut header
    .slice(1)
    // cut outcomes
    .filter((it) => !it.includes("Продаж валюти"));

  const incomes = lines.map((line) => {
    // "03.01.2023 17:08:27" => 03.01.2023
    const date = toDate(line.split(",")[0].replaceAll('"', "").split(" ")[0]);

    // cut values around currency to avoid messing with characters in 'name'
    // 3900.41,1000.0,EUR,39.0041
    const matches = line.match(/[\d.]+,[\d.]+,[A-Z]{3},[\d.]+/g);

    const [uah, amount, currency, rate] = (matches![0] || "").split(",");
    const tax = taxFor(Number(uah));
    return {
      date,
      uah: Number(uah),
      amount: Number(amount),
      currency,
      rate: Number(rate),
      tax,
    };
  });
  return incomes;
};

export const parsePrivatXls = (array: ArrayBuffer): IncomeDTO[] => {
  const workbook = (XLSX as any).read(array, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Array<Array<any>> = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });
  return rows
    .filter((cells) => cells[3] && cells[3] > 0)
    .map(([_, date, , amount, currency, rate, uah]) => ({
      date: toDate(date),
      amount,
      currency,
      rate: parseFloat(rate.replace(",", ".")),
      uah: parseFloat(uah.replace(",", ".")),
      tax: taxFor(parseFloat(uah.replace(",", "."))),
    }));
};

// '10.04.2023' => Date
export const toDate = (date: string) => {
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day);
};

export const validate = (args: { date: Date; amount: number }) =>
  z
    .object({
      date: z.date().refine((value) => value.getTime() < Date.now()),
      amount: z.number().positive(),
    })
    .parseAsync(args)
    .catch(
      (error) =>
        error.issues.map((it: { path: string[] }) => it.path[0]) as Promise<
          string[]
        >
    )
    .then(() => []);

// [ { r030: 978, txt: "Євро", rate: 32.9039, cc: "EUR", exchangedate: "23.02.2022" } ];
export const getRate = (currency: string, date: Date): Promise<Rate> =>
  fetch(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${format(
      date,
      "yyyyMMdd"
    )}&json`
  )
    .then((it) => it.json())
    .then((rates) => rates[0]);

const PERCENT_TAX = 5;

export const taxFor = (sum: number) =>
  Number(((PERCENT_TAX * sum) / 100).toFixed(3));

export const sumOf = (incomes: Income[], mapper: (it: Income) => number) =>
  Number(
    incomes
      .map(mapper)
      .reduce((acc, it) => acc + it, 0)
      .toFixed(2)
  );

export const prettyPrint = (num: number): string => {
  const formattedNum = num.toLocaleString("en");
  return formattedNum.replace(/,/g, " ");
};
