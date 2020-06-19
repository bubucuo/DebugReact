import {React, useState, Component} from "../CONST";

const ProcessInput = ({value, onChange}) =>
  React.cloneElement(<input />, {
    placeholder: "omg",
    value,
    onChange: e => {
      onChange(e.target.value);
    }
  });

export default function CloneElementPage(props) {
  const [value, onChange] = useState("");
  return (
    <div>
      <h3>CloneElementPage</h3>
      <ProcessInput value={value} onChange={onChange} />
    </div>
  );
}
