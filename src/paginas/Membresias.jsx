import TablaMembresias from "../componentes/TablaMembresias";

function Membresias() {
  return (
    <div className="p-3">
       <div className="alert alert-info  mt-4 text-center" role="alert">
        <p className="fs-5">Membresías</p>
      </div>
      <TablaMembresias />
    </div>
  );
}

export default Membresias;
