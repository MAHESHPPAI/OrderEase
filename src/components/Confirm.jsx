import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Confirm() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!uid) return;

      try {
        await updateDoc(doc(db, 'users', uid), {
          verified: true
        });
        alert('Email confirmed successfully!');
        navigate('/login');
      } catch (err) {
        alert(`Invalid or expired confirmation link. ${err.value}`);
      }
    };

    verifyUser();
  }, [uid, navigate]);

  return <div>Verifying your email...</div>;
}

export default Confirm;
