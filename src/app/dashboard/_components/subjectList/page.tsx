'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FixedSizeGrid as Grid } from 'react-window';

type Subject = {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
};

export default function QuizGrid({ initialSubjects }: { initialSubjects: Subject[] }) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [page, setPage] = useState(2); // Start with the next page
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Flag to check if there are more subjects
  const loaderRef = useRef<HTMLDivElement>(null); // For detecting when the user scrolls near the bottom

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/subject?page=${page}&limit=3`);
      const data = await response.json();

      // Check if there are subjects in the response
      const newSubjects = data.subjects;

      if (newSubjects && newSubjects.length > 0) {
        setSubjects((prevSubjects) => [
          ...prevSubjects,
          ...newSubjects.filter(
            (newSubject : Subject) => !prevSubjects.some((prev) => prev._id === newSubject._id)
          ),
        ]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false); // No more subjects to load
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin: '100px', // Trigger when the loader is 100px from the viewport bottom
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore]);

  const columnCount = 3;
  const itemHeight = 350;
  const itemWidth = 330;

  const renderCell = ({ columnIndex, rowIndex, style } : renderCell) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= subjects.length) return null;
    const subject = subjects[index];

    return (
      <div style={style} key={subject._id}>
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

      {isLoading && <p>Loading more subjects...</p>}

      {/* Invisible loader element that triggers loading more when it's near the bottom */}
      <div ref={loaderRef} style={{ height: '50px', width: '100%' }}></div>

      {/* Show message when no more subjects are available */}
      {!hasMore && <p>No more subjects to load.</p>}
    </div>
  );
}
