import JsonViewer from "@/components/JsonViewer.js";

export default function Page(){
  const json = {
    foo: 'bar',
    number: 42,
  }

  return (<>
    <JsonViewer json={json} />
  </>)

}