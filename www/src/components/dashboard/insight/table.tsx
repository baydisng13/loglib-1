import { ScrollArea } from "../../ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { TableLoading } from "../table-loading"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Tip } from "../tooltip"

type InsightProps<T> = {
  isLoading: boolean
  data?: T[]
  meta: {
    key: keyof T
    nameLabel: string
    valueLabel: string
  }
  Row: (data: T) => React.ReactElement
  searchFn?: (term: string) => void
  hideSearchBar?: boolean
  searchPlaceholder: string
  tip?: string
}

export function InsightTable<T>({
  isLoading,
  data,
  meta,
  searchFn,
  Row,
  hideSearchBar,
  tip,
  searchPlaceholder,
}: InsightProps<T>) {
  const [term, setTerm] = useState("")
  const [lData, setLData] = useState<T[]>([])
  useEffect(() => {
    if (term) {
      if (data) {
        setLData(
          data.filter((d) =>
            (d[meta.key] as string).toLowerCase().includes(term.toLowerCase())
          )
        )
      }
    }
    if (!term && data) {
      setLData(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, data])
  return (
    <ScrollArea className=" md:h-96 h-72">
      <Table>
        <TableCaption>{tip}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{meta.nameLabel}</TableHead>
            <TableHead className="text-right">{meta.valueLabel}</TableHead>
          </TableRow>
          {!isLoading && !hideSearchBar && (
            <TableHead colSpan={2} className=" px-0">
              <div className="flex h-10 w-full items-center rounded-md border  border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-800 relative">
                <input
                  onChange={(e) => setTerm(e.target.value)}
                  className=" bg-transparent flex-grow focus:outline-none outline-none"
                  placeholder={searchPlaceholder}
                  value={term}
                />

                <Tip tip="This will also filter the data">
                  <Search
                    size={16}
                    className=" cursor-pointer"
                    onClick={() => {
                      if (term) {
                        searchFn && searchFn(term)
                      }
                    }}
                  />
                </Tip>
              </div>
            </TableHead>
          )}
        </TableHeader>
        {isLoading || !data ? (
          <TableLoading cellCount={2} />
        ) : (
          <TableBody>
            {lData.map((d, i) => {
              return <Row {...d} key={i} />
            })}
          </TableBody>
        )}
      </Table>
    </ScrollArea>
  )
}
