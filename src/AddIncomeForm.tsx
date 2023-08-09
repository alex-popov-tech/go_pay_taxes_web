import { ButtonHTMLAttributes, ReactNode, useRef, useState } from "react";
import csm from "currency-symbol-map";
import { IncomeDTO } from "./types";
import {
  getRate,
  parseMonoCsv,
  parsePrivatXls,
  toDate,
  validate,
  taxFor,
} from "./utils";

type Props = {
  onSubmit: (incomes: Array<IncomeDTO>) => void | any;
};

const Button = ({
  klass,
  children,
  ...rest
}: {
  klass: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...rest} className={`${klass} p-1 text-lg rounded-md`}>
    {children}
  </button>
);

const Input = ({
  isError,
  ...rest
}: {
  isError: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const color = isError ? "#FF3419" : "#888888";
  return (
    <input
      {...rest}
      className={`p-1 border-solid border-2 rounded-md border-[${color}]`}
    />
  );
};

export default function AddIncomeForm(props: Props) {
  const [dateString, setDateString] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [amount, setAmount] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);
  const monoInputRef = useRef<HTMLInputElement>(null);
  const privatInputRef = useRef<HTMLInputElement>(null);

  const onSumbit = async () => {
    const date = toDate(dateString);
    const errors = await validate({ date, amount });

    setErrors(errors);
    if (errors.length) {
      return;
    }

    const rate = await getRate(currency, date).then((it) => it.rate);
    const uah = Number((amount * rate));
    const tax = taxFor(uah);
    const income = {
      date,
      currency,
      amount,
      rate,
      uah,
      tax,
    };

    props.onSubmit([income]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSumbit();
    }
  };

  return (
    <>
      <div className="w-fit flex flex-col gap-3 w-full md:w-44">
        <Button
          klass="transition-all text-[#FFFFFF] bg-[#000000] hover:bg-[#303436] active:bg-[#1A1C1D]"
          onClick={() => monoInputRef.current && monoInputRef.current.click()}
        >
          Upload mono csv
        </Button>
        <input
          className="hidden"
          ref={monoInputRef}
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const files = e.target.files as FileList;
            const file = files[0];
            const array = await file.arrayBuffer();
            const decoder = new TextDecoder("utf-8");
            const incomes = parseMonoCsv(decoder.decode(array));
            props.onSubmit(incomes);
          }}
        />
        <Button
          klass="transition-all text-[#E8E6E3] bg-[#5E8C1E] hover:bg-[#48760D] active:bg-[#3E5C11]"
          onClick={() =>
            privatInputRef.current && privatInputRef.current.click()
          }
        >
          Upload privat xls
        </Button>
        <input
          className="hidden"
          ref={privatInputRef}
          type="file"
          accept=".xls"
          onChange={async (e) => {
            const files = e.target.files as FileList;
            const file = files[0];
            const array = await file.arrayBuffer();
            const incomes = parsePrivatXls(array);
            props.onSubmit(incomes);
          }}
        />
        <div className="flex flex-col">
          <label className="text-lg text-[#444444]">Date</label>
          <Input
            isError={errors.includes("date")}
            type="text"
            placeholder="dd.mm.yyyy"
            value={dateString}
            onChange={(e) => setDateString(e.target.value.trim())}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg text-[#444444]">Currency</label>
          <select
            className="p-1 border-solid border-2 rounded-md border-[#888888]"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option key="USD" value="USD">
              USD
            </option>
            <option key="EUR" value="EUR">
              EUR
            </option>
            {Object.keys(csm.currencySymbolMap)
              .filter((it) => !["USD", "EUR"].includes(it))
              .map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-lg text-[#444444]">Amount</label>
          <Input
            isError={errors.includes("amount")}
            type="number"
            placeholder="1488.24"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          klass="transition-all text-[#FFFFFF] bg-[#0088FF] hover:bg-[#0077D7] active:bg-[#005FA3]"
          onClick={onSumbit}
        >
          Add Income
        </Button>
      </div>
    </>
  );
}
