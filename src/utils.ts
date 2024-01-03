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

export const parsePrivatCsv = async (csv: string): Promise<IncomeDTO[]> => {
  const lines = csv
    .split("\n")
    // cut header
    .slice(1)
    // cut last empty line
    .filter((it) => it)
    .map((row) => {
      console.log({ row });

      const chunks = row.split(";");
      const currency = chunks[3];
      const date = toDate(chunks[5]);
      const amount = Number(chunks[11].replaceAll(/\s/g, ""));
      console.log({ currency, date, amount });

      return { currency, date, amount };
    })
    // cut sell operations
    .filter((it) => it.amount > 0);
  console.log(lines);

  const incomes = await Promise.all(
    lines.map((it) =>
      (async () => {
        const rate = await getRate(it.currency, it.date).then((it) => it.rate);
        const uah = Number(it.amount * rate);
        const tax = taxFor(uah);
        return {
          ...it,
          uah,
          rate,
          tax,
        };
      })(),
    ),
  );
  return incomes;
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
        >,
    )
    .then(() => []);

// [ { r030: 978, txt: "Євро", rate: 32.9039, cc: "EUR", exchangedate: "23.02.2022" } ];
export const getRate = (currency: string, date: Date): Promise<Rate> =>
  fetch(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${format(
      date,
      "yyyyMMdd",
    )}&json`,
  )
    .then((it) => it.json())
    .then((rates) => rates[0]);

const PERCENT_TAX = 5;

export const taxFor = (sum: number) => Number((PERCENT_TAX * sum) / 100);

export const sumOf = (incomes: Income[], mapper: (it: Income) => number) =>
  Number(incomes.map(mapper).reduce((acc, it) => acc + it, 0));

export const prettyPrint = (num: number): string => {
  const rounded = Number(num.toFixed(2));
  const formattedNum = rounded.toLocaleString("en").replace(/,/g, " ");
  const decimalPart = formattedNum.split(".")[1];
  return decimalPart && decimalPart.length === 1
    ? formattedNum + "0"
    : formattedNum;
};
