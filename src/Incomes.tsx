import { Income } from "./types";
import csm from "currency-symbol-map";
import { copyToClipboard } from "./utils";

type Props = {
  incomes: Income[];
  removeById: (id: string) => void | any;
};

export default function Incomes({ removeById, incomes }: Props) {
  return (
    <>
      <div className="flex justify-center flex-col">
        {incomes.map(({ id, date, currency, amount, rate, uah }) => (
          <div
            key={id}
            className="flex justify-between items-center text-[#444444]"
          >
            <span className="text-base">
              {`${date}: ${amount}${csm.currencySymbolMap[currency]} * ${rate}`}
            </span>
            <div className="text-base flex items-center gap-1">
              <span className="cursor-pointer" onClick={copyToClipboard(uah)}>
                {uah}₴
              </span>
              <button onClick={() => removeById(id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="4 4 16 16"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
