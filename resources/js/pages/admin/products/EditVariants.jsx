import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditVariants(){

  const { id } = useParams();

  const [variants,setVariants] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(()=>{

    fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    .then(res=>res.json())
    .then(data=>{
      setVariants(data.variants || [])
    });

  },[id, token]);

  const updateVariant=(index,field,value)=>{

    const newVariants=[...variants];
    newVariants[index][field]=value;

    setVariants(newVariants);
  }

  const saveVariants = async()=>{

    const res = await fetch(`http://127.0.0.1:8000/api/admin/products/${id}/variants`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json",
        "Authorization": `Bearer ${token}`
      },
      body:JSON.stringify({variants})
    });

    if(res.ok){
      alert("Variants updated");
    }
  }

  return(

    <div className="container">

      <h3 className="my-4">Edit Variants</h3>

      {variants.map((v,i)=>(
        <div key={i} className="border p-3 mb-3">

          <input
            value={v.sku}
            onChange={(e)=>updateVariant(i,"sku",e.target.value)}
            className="form-control mb-2"
          />

          <input
            value={v.color}
            onChange={(e)=>updateVariant(i,"color",e.target.value)}
            className="form-control mb-2"
          />

          <input
            value={v.storage}
            onChange={(e)=>updateVariant(i,"storage",e.target.value)}
            className="form-control mb-2"
          />

          <input
            value={v.price}
            onChange={(e)=>updateVariant(i,"price",e.target.value)}
            className="form-control mb-2"
          />

          <input
            value={v.stock}
            onChange={(e)=>updateVariant(i,"stock",e.target.value)}
            className="form-control"
          />

        </div>
      ))}

      <button onClick={saveVariants} className="btn btn-primary">
        Save Variants
      </button>

    </div>

  )
}
