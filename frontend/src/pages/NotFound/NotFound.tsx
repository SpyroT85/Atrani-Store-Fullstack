import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 gap-12">
        <h1 className="text-5xl font-extrabold text-gray-900">ERROR 404</h1>
        <h2 className="text-4xl font-bold text-gray-900">Oops! Page not found!</h2>
        <Link to="/">
          <Button
            variant="outline"
            className="bg-[#A67C52] text-white hover:text-white uppercase tracking-widest text-sm font-bold hover:bg-[#8a5e3a] transition border-none cursor-pointer rounded-md flex items-center gap-2"
            style={{ paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
            aria-label="Back to Homepage"
          >
            <BsFillArrowLeftSquareFill className="mr-2 text-xl" />
            Back to Homepage
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
