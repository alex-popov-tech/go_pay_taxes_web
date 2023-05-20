import { useState } from "react";
import TaxDetails from "./TaxDetails";
import AddIncomeForm from "./AddIncomeForm";
import { Income } from "./types";
import Incomes from "./Incomes";
import _ from "lodash";

function App() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  return (
    <>
      <main className="h-screen flex justify-center flex-col items-center">
        <div className="h-fit w-fit max-w-2xl bg-[#FDFDFD] rounded-lg">
          <section className="text-center text-4xl p-3">
            <h1>Go pay taxes!</h1>
          </section>
          <div className="flex divide-x-[1px] pb-3">
            <section className="px-3">
              <AddIncomeForm
                onSubmit={(newIncomes) =>
                  setIncomes([
                    ...incomes,
                    ...newIncomes.map((it) => ({ ...it, id: _.uniqueId() })),
                  ])
                }
              />
            </section>
            <section className="px-3 flex flex-col h-auto w-112 justify-between">
              {!incomes.length && (
                <div className="h-full flex justify-center items-center">
                  <span className="text-3xl text-[#888888]">
                    &#x21E6; Add some transactions first
                  </span>
                </div>
              )}
              <Incomes
                incomes={incomes}
                removeById={(id) =>
                  setIncomes(incomes.filter((it) => it.id !== id))
                }
              />
              <TaxDetails incomes={incomes} />
            </section>
          </div>
          <p className="pb-3 px-3 text-xs text-center text-gray-400">
            This app uses{" "}
            <a
              className="underline"
              href="https://bank.gov.ua/ua/open-data/api-dev"
            >
              official nbu api
            </a>{" "}
            for getting currency rates for a specific dates. If something is not
            working as intended, please open an{" "}
            <a className="underline" href="https://github.com/alex-popov-tech/go_pay_taxes_web/issues">
              issue
            </a>{" "}
            on Github.
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
