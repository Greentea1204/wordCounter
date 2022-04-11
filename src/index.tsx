
import ForgeUI, 
  {render, Fragment, Macro,
  Text, Button, Form,
  Table,
  Head,
  Cell,
  Row, SectionMessage, 
  TextArea, useState, RadioGroup, Radio } from "@forge/ui";

const STATE = {
  INITIAL: 0,
  INPUT: 1,
  SUCCESS: 2
};

const App = () => {

  const [state, setState] = useState(STATE.INITIAL);
  const [wordMap, setWordMap] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [resultsby, setResultsby] = useState("0")
  const [orderby, setOrderby] = useState("0")

  switch (state) {
    case STATE.INITIAL:
      return doInitial();
    case STATE.SUCCESS:
      return doSuccess();
  }

  function doInitial() {
      return (
        <Fragment>
          <Form onSubmit={startCounting}
            submitButtonText={`Let's start counting!`}
          >
            <Button
              text="📣 Close word counting"
              onClick={() => { setState(STATE.SUCCESS); }}
              />

            <Text>Word Counter Macro for Confluence Cloud</Text>
            <TextArea label="Your input field" name="inputField" isRequired={true} />

            <RadioGroup label="Sort results by" name="sortResultsby" >
              {resultsby == "0" ? 
              <Radio label="Word" value="0" defaultChecked/> :  
              <Radio label="Word" value="0" /> }
              {resultsby == "1" ?
               <Radio label="Count" value="1" defaultChecked /> :
               <Radio label="Count" value="1" /> }
            </RadioGroup>

            <RadioGroup label="Sort order by" name="sortOrderby">
              {orderby == "0" ? <Radio label="Ascending" value="0" defaultChecked /> :
               <Radio label="Ascending" value="0" />}
              {orderby == "1" ? <Radio label="Descending" value="0" defaultChecked /> :
              <Radio label="Descending" value="1" /> }
            </RadioGroup>

            <SectionMessage title="You Entered:" appearance="confirmation">
              <Text>{userInput}</Text>
            </SectionMessage>

            <Table>
              <Head>
                <Cell>
                  <Text>Word</Text>
                </Cell>
                <Cell>
                  <Text>Count</Text>
                </Cell>
              </Head>
              {!!wordMap ? Array.from(wordMap).map(([key, value]) => 
              <Row>
                  <Cell>
                    <Text>{key}</Text>
                  </Cell>
                  <Cell>
                    <Text>{value}</Text>
                  </Cell>
              </Row>
              ): <Row>
              </Row>}
            </Table>
          </Form>
        </Fragment>
      )
  }

  function startCounting({inputField, sortResultsby, sortOrderby}) {
    // implement the logic of counting words
    const trimmedField = inputField.trim();
    if (trimmedField.length <= 0) return;
    setUserInput(trimmedField);
    setResultsby(sortResultsby);
    setOrderby(sortOrderby);
    const newMap = new Map();
    trimmedField.split(' ').map(((key: any) => {
        newMap.has(key) ? newMap.set(key, newMap.get(key) + 1) : newMap.set(key, 1);
    }));

    let newMapEx;

    // sort by Count(value) and Descending
    if (sortResultsby == "1" && sortOrderby == "1") {
      newMapEx = new Map([...newMap.entries()].sort((a, b) => b[1] - a[1]));
    } else if (sortResultsby == "1" && sortOrderby == "0" ) { //sort by Count(value) and ascending
      newMapEx = new Map([...newMap.entries()].sort((a, b) => a[1] - b[1]));
    }  else if (sortResultsby == "0" && sortOrderby === "1" ) { //sort by Word(key) and Descending
      newMapEx = new Map([...newMap.entries()].reverse());
    }  else if (sortResultsby == "0" && sortOrderby == "0") { //sort by Word(key) and ascending
      newMapEx = new Map([...newMap.entries()].sort());
    } else {
      newMapEx = new Map([...newMap.entries()].sort());
    } 

    
    setWordMap(newMapEx);

    // setState(STATE.SUCCESS);
  }

  function doSuccess() {
    return (
      <Fragment>
        <Button
          text="📣 Do more counting?"
          onClick={() => { setState(STATE.INITIAL); }}
        />
      </Fragment>
    );
  }
};

export const run = render(
  <Macro
    app={<App />}
  />
);
