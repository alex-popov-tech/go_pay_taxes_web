import { useEffect, useState } from "react";
import AddIncomeForm from "./AddIncomeForm";
import { Income, IncomeDTO } from "./types";
import _ from "lodash";
import Incomes from "./Incomes";

function GithubRef() {
  return (
    <div className="absolute top-0 right-0">
      <div className="w-28 h-28">
        <div
          style={{ clipPath: "polygon(0% 0%, 100% 100%, 100% 0%, 0% 0%)" }}
          className="bg-[#FDFDFD]"
        >
          <a
            href="https://github.com/alex-popov-tech/go_pay_taxes_web"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="rotate-45 -translate-y-6 translate-x-6 scale-75"
              src="../629b7a8e7c5cd817694c322e.png"
              alt="GitHub Octocat"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function Note() {
  return (
    <div className="w-full flex flex-col text-center text-xs text-gray-400">
      <p>
        This app uses{" "}
        <a
          className="underline"
          href="https://bank.gov.ua/ua/open-data/api-dev"
        >
          official nbu api
        </a>{" "}
        for getting currency rates for a specific dates.
      </p>
      <p>
        If something is not working as intended, please open an{" "}
        <a
          className="underline"
          href="https://github.com/alex-popov-tech/go_pay_taxes_web/issues"
        >
          issue
        </a>{" "}
        on Github.
      </p>
    </div>
  );
}

export default function App() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    console.log(incomes);
  }, [incomes]);

  const addNewIncome = (newIncomes: IncomeDTO[]) =>
    setIncomes([
      ...incomes,
      ...newIncomes.map((it) => ({
        ...it,
        id: _.uniqueId(),
      })),
    ]);
  const removeById = (id: string) =>
    setIncomes(incomes.filter((it) => it.id !== id));
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <GithubRef />
        <main className="h-fit w-4/5 md:w-fit p-3 bg-[#FDFDFD] rounded-lg">
          <h1 className="text-center text-4xl">Go pay taxes!</h1>
          <section className="w-auto my-3 flex flex-wrap max-md:flex-col max-md:items-center gap-5">
            <AddIncomeForm onSubmit={addNewIncome} />
            <Incomes incomes={incomes} removeById={removeById} />
          </section>
          <Note />
        </main>
      </div>
    </>
  );
}
