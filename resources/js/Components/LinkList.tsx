import { Link, Links } from '@/Pages/Dashboard';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

function LinkItem({ link }: { link: Link }) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentClipboard, setCurrentClipboard] = useState('');
    const { data, put, setData } = useForm({
        title: link.title,
    });

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (link.title === data.title) {
            setIsEditing(!isEditing);
            return;
        }
        put(`/links/${link.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(!isEditing);
            },
        });
    }

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    return (
        <div
            className={'grid grid-cols-[minmax(0,8rem),1fr] gap-4'}
            key={link.id}
        >
            <div className={'overflow-hidden rounded-sm'}>
                {link.image && (
                    <img
                        className={'h-full w-full object-cover'}
                        src={link.image}
                        alt={link.title}
                    />
                )}
            </div>
            <form
                className={
                    'prose grid max-w-none grid-cols-[2fr,auto] items-center dark:prose-invert'
                }
                onSubmit={handleSubmit}
            >
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={'bg-transparent px-2'}
                        placeholder={link.title}
                    />
                ) : (
                    <a
                        rel="noreferrer"
                        target={'_blank'}
                        className={'px-2'}
                        href={link.original_url}
                    >
                        {link.title ?? link.original_url}
                    </a>
                )}

                <div className={'flex items-center justify-center px-4'}>
                    <button
                        type={isEditing ? 'submit' : 'button'}
                        onClick={
                            !isEditing
                                ? () => setIsEditing(!isEditing)
                                : undefined
                        }
                    >
                        {isEditing ? (
                            <Check className={'size-4'} />
                        ) : (
                            <PencilSquareIcon className={'size-4'} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function LinkList({ links }: { links: Links }) {
    return (
        <div
            className={
                'mx-auto mt-8 grid w-full max-w-7xl auto-rows-[minmax(0,4rem)] gap-4'
            }
        >
            {links.map((link) => (
                <LinkItem link={link} key={link.id} />
            ))}
        </div>
    );
}
