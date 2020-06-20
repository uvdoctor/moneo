import React, { useEffect } from 'react'

interface GoalModalProps {
    showHandler: Function
}
export default function GoalModal({ showHandler }: GoalModalProps) {
    useEffect(() => console.log("Inside GoalModal..."))

    return (
        <div className="modal opacity-0 pointer-events-none fixed w-screen h-screen top-0 left-0 flex items-center justify-center">

            <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

                <div className="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
                    <svg className="fill-current text-white" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                    </svg>
                    <span className="text-sm">(Esc)</span>
                </div>

            </div>
        </div>

    )
}