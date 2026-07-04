export default function AddressSkeleton(){

    return(

        <div className="space-y-4">

            {

                Array.from({

                    length:3

                }).map((_,i)=>(

                    <div

                        key={i}

                        className="animate-pulse rounded-xl border p-5"

                    >

                        <div className="h-5 w-48 rounded bg-gray-200"/>

                        <div className="mt-4 h-4 w-full rounded bg-gray-200"/>

                        <div className="mt-2 h-4 w-3/4 rounded bg-gray-200"/>

                    </div>

                ))

            }

        </div>

    )

}
