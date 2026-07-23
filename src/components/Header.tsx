import { Button } from './Button';

export function Header() {
  // const { autoArrangeMosaic } = useStudio();
  return (
    <div className="flex justify-between items-center ml-1 mr-1">
      <div className="flex justify-center items-center gap-1">
        <Button
          variant="link"
          size="icon"
          onClick={() => window.open('https://linktr.ee/uqneurotech')}
        >
          <img
            src="/UQNeuroTechLogo_purpleWhite.png"
            alt="UQNeuroTech Logo"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </Button>

        <div className="w-px h-6 bg-secondary" />

        {/* <Button onClick={autoArrangeMosaic}>Auto Arrange</Button> */}
        <Button>Auto Arrange</Button>
        <Button>Run Code</Button>
      </div>
      <div className="flex justify-center items-center gap-1">
        <Button>Export Blocks</Button>
        <Button>Import Blocks</Button>
      </div>
    </div>
  );
}
