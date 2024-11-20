import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Fragment } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/outline";

type TokenPickerProps = {
  token: string;
  setToken: (token: string) => void;
};

export function TokenPicker({ token, setToken }: TokenPickerProps) {
  return (
    <div className="flex w-full flex-col">
      <label className="w-full text-left text-lg">Token</label>
      <Listbox value={token} onChange={setToken}>
        <div className="relative mt-1">
          <ListboxButton className="flex h-14 w-full items-center justify-between whitespace-nowrap rounded-xl border-2 border-black bg-transparent px-3 py-2 text-base">
            <span className="block truncate capitalize">{token}</span>
            <ChevronUpDownIcon className="h-4 w-4 opacity-50" />
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border-2 border-black bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
              {["usdc", "brother", "slink", "alf"].map((token) => (
                <ListboxOption
                  key={token}
                  value={token}
                  className={({ selected }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      selected ? "bg-gray-100" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate capitalize ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {token === "brother"
                          ? "STARKNET BROTHER"
                          : token.toUpperCase()}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
