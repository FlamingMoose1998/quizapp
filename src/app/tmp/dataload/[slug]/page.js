import Test from "../Test.js";
import getData from "../server.js";


export default async function Page({ params }){
  const { slug } = await params;

  console.log(slug);
  const data = await getData();
  console.log(data);


  return (<>
    <Test id={data} />
  </>)
}




