import type { Link } from '@/services/types';

interface LinkButtonProps {
  link: Link;
}

export function LinkButton({ link }: LinkButtonProps): React.ReactElement {
  // Special handling for image links - display as a visual divider
  if (link.id === 'image' && (link.url.endsWith('.jpg') || link.url.endsWith('.png'))) {
    return (
      <div className="my-2 overflow-hidden rounded-lg">
        <img
          src={link.url}
          alt={link.title}
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        {link.icon && (
          <span className="text-2xl flex-shrink-0" aria-hidden="true">
            {link.icon}
          </span>
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base">{link.title}</h3>

          {/* Description */}
          {link.description && (
            <p className="text-sm text-gray-500 mt-1 truncate">{link.description}</p>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="text-gray-400 flex-shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
