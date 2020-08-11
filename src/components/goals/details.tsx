import TextInput from "../form/textinput";

interface GoalDetailsProps {
  currentOrder: number;
  nextStepDisabled: boolean;
  value: string;
  allInputDone: boolean;
  nextStepHandler: Function;
  pre: any;
  changeHandler: Function;
}

export default function GoalDetail({
  currentOrder,
  nextStepDisabled,
  allInputDone,
  nextStepHandler,
  pre,
  changeHandler,
  value,
}: GoalDetailsProps) {
  return (
    <div className="flex flex-wrap justify-between items-start w-full">
      <TextInput
        name="name"
        inputOrder={1}
        currentOrder={currentOrder}
        nextStepDisabled={nextStepDisabled}
        allInputDone={allInputDone}
        nextStepHandler={nextStepHandler}
        pre={pre}
        placeholder="Goal Name"
        value={value}
        changeHandler={changeHandler}
        width="200px"
      />
    </div>
  );
}
