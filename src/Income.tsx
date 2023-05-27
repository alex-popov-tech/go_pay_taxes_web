import { Income as IncomeType } from "./types";
import csm from "currency-symbol-map";
import { copyToClipboard, prettyPrint } from "./utils";
import { format } from "date-fns";

type Props = {
  income: IncomeType;
  remove: () => void | any;
};

export default function Income({
  remove,
  income: { date, rate, amount, uah, currency, tax },
}: Props) {
  return (
    <>
      <span className="hidden md:inline md:justify-self-start text-[#444444]">
        {format(date, "dd.MM.yyyy")}
      </span>
      <div className="hidden md:inline text-[#444444]">{rate}</div>
      <div>
        {prettyPrint(amount)}
        {csm.currencySymbolMap[currency]}
      </div>
      <div
        className="whitespace-nowrap cursor-pointer text-[#444444]"
        onClick={copyToClipboard(uah)}
      >
        {prettyPrint(uah)}₴
      </div>
      <span className="text-[#444444]">{prettyPrint(tax)}₴</span>
      <button onClick={remove}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="4 4 16 16"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </button>
    </>
  );
}
