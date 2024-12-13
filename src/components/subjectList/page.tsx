'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

type Subject = {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
};

export default function QuizGrid() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;

  const { data: session, status } = useSession(); 
  const token = session?.token;

  console.log('Session Token:', token);

  const fetchSubjects = useCallback(async () => {
    if (!token || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await axios.get('https://exam.elevateegy.com/api/v1/subjects', {
        params: { page, limit },
        headers: {
          token
        },
      });

      const newSubjects = res.data.subjects;

      if (newSubjects.length < limit) {
        setHasMore(false);
      }

      setSubjects((prevSubjects) => [...prevSubjects, ...newSubjects]);
    } catch (error: any) {
      const message = error.response
        ? error.response.data.message || error.response.statusText
        : error.message;

      setError(`Failed to fetch subjects: ${message}`);
      console.error('Error fetching subjects:', error.response || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, hasMore, token]);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchSubjects();
    }
  }, [status, token, fetchSubjects]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const columnCount = 3; 
  const itemHeight = 350; 
  const itemWidth = 330; 

  const renderCell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= subjects.length) return null; 
    const subject = subjects[index];

    return (
      <div style={style}  key={subject._id}>
        <Link href={`/dashboard/${subject._id}`}>
          <div className="relative mr-5 rounded-[20px] shadow-md">
            <Image
              src={subject.icon}
              alt={subject.name}
              width={330}
              height={292}
              className="w-full rounded-xl h-[292px] object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 m-4 bg-[#1935CA] bg-opacity-40 backdrop-blur-[27.01px] text-white rounded-xl">
              <h3 className="font-bold text-sm mb-1">{subject.name}</h3>
              <p className="text-xs font-medium">{subject._id}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md py-8 px-4 mt-7 rounded-[20px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#4461F2] text-[24px] font-medium">Quizzes</h2>

      </div>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <Grid
          columnCount={columnCount}
          columnWidth={itemWidth}
          height={600}
          rowCount={Math.ceil(subjects.length / columnCount)}
          rowHeight={itemHeight}
          width={window.innerWidth - 40}
        >
          {renderCell}
        </Grid>
      )}

      {isLoading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
